import { AnimatePresence, motion } from "framer-motion";
import { Bell, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "src/components/ui/alert";
import { Button } from "src/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/components/ui/popover";
import { useSpendingApps } from "src/hooks/useSpendingApps";

const NOTIFICATION_DISMISSED_KEY = "spending-apps-notification-dismissed";
const NOTIFICATION_CLEARED_KEY = "spending-apps-notification-cleared";

export function SpendingAppsNotification() {
  const spendingApps = useSpendingApps();
  const navigate = useNavigate();

  // Reset state when no spending apps exist
  const shouldReset = spendingApps.length === 0;

  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem(NOTIFICATION_DISMISSED_KEY) === "true";
  });
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  // Clear localStorage when no spending apps
  if (shouldReset) {
    if (localStorage.getItem(NOTIFICATION_DISMISSED_KEY)) {
      localStorage.removeItem(NOTIFICATION_DISMISSED_KEY);
    }
    if (localStorage.getItem(NOTIFICATION_CLEARED_KEY)) {
      localStorage.removeItem(NOTIFICATION_CLEARED_KEY);
    }
  }

  const handleDismiss = () => {
    // Start animation
    setIsAnimatingOut(true);
    // Wait for animation to complete before actually dismissing
    setTimeout(() => {
      localStorage.setItem(NOTIFICATION_DISMISSED_KEY, "true");
      setIsDismissed(true);
      setIsAnimatingOut(false);
    }, 600); // Match animation duration
  };

  const handleReview = () => {
    navigate("/apps");
  };

  // Don't show alert card if dismissed or no spending apps
  if (isDismissed || spendingApps.length === 0) {
    return null;
  }

  const appCount = spendingApps.length;
  const appText = appCount === 1 ? "app has" : "apps have";

  return (
    <AnimatePresence>
      {!isAnimatingOut ? (
        <motion.div
          key="notification"
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{
            x: -400,
            y: -100,
            scale: 0.3,
            opacity: 0,
          }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
          }}
          className="fixed top-4 right-4 z-50 max-w-md"
        >
          <Alert variant="default" className="shadow-lg border-2">
            <Bell className="size-4" />
            <AlertTitle>Connected Apps with Spending Permissions</AlertTitle>
            <AlertDescription>
              <p className="mb-3">
                {appCount} {appText} spending permissions. Review to ensure
                they're still needed.
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handleReview}
                  size="sm"
                  variant="default"
                  className="flex-1"
                >
                  Review Apps
                </Button>
                <Button
                  onClick={handleDismiss}
                  size="sm"
                  variant="ghost"
                  className="px-2"
                >
                  <X className="size-4" />
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function NotificationBellIcon() {
  const spendingApps = useSpendingApps();
  const navigate = useNavigate();

  const shouldReset = spendingApps.length === 0;

  const [isCleared, setIsCleared] = useState(() => {
    return localStorage.getItem(NOTIFICATION_CLEARED_KEY) === "true";
  });
  const isDismissed =
    localStorage.getItem(NOTIFICATION_DISMISSED_KEY) === "true";

  // Clear localStorage when no spending apps
  if (shouldReset && localStorage.getItem(NOTIFICATION_CLEARED_KEY)) {
    localStorage.removeItem(NOTIFICATION_CLEARED_KEY);
  }

  const handleClearAll = () => {
    localStorage.setItem(NOTIFICATION_CLEARED_KEY, "true");
    setIsCleared(true);
  };

  const handleViewApps = () => {
    navigate("/apps");
  };

  if (spendingApps.length === 0) {
    return null;
  }

  const hasUnreadNotifications = isDismissed && !isCleared;
  const appCount = spendingApps.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative focus:outline-none">
          <Bell className="size-5" />
          {hasUnreadNotifications && (
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-destructive rounded-full" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Notifications</h4>
            {hasUnreadNotifications && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleClearAll}
                className="h-auto p-1 text-xs"
              >
                Clear All
              </Button>
            )}
          </div>
          {hasUnreadNotifications ? (
            <div className="space-y-2">
              <div className="text-sm">
                <p className="font-medium">Spending Permissions Alert</p>
                <p className="text-muted-foreground text-xs mt-1">
                  {appCount} {appCount === 1 ? "app has" : "apps have"} spending
                  permissions
                </p>
              </div>
              <Button size="sm" onClick={handleViewApps} className="w-full">
                Review Apps
              </Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
