import { useApps } from "src/hooks/useApps";

export function useSpendingApps() {
  const { data: spendingAppsData } = useApps(
    undefined,
    undefined,
    {
      spendingApps: true,
    },
    undefined
  );
  return spendingAppsData?.apps || [];
}
