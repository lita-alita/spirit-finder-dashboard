import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deploySquad, fetchAnomalies } from '@/shared/api/anomaly';

export const anomaliesQueryKey = ['anomalies'];

export const useAnomalies = () =>
  useQuery({
    queryKey: anomaliesQueryKey,
    queryFn: fetchAnomalies,
    refetchInterval: 5_000,
  });

export const useDeploySquad = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deploySquad(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: anomaliesQueryKey });
    },
  });
};
