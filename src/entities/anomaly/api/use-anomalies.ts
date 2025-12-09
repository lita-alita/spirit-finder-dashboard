import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deploySquad, fetchAnomalies } from '@/shared/api/anomaly';
import type { Anomaly } from '../model/types';

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
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: anomaliesQueryKey });
      const previous = queryClient.getQueryData<Anomaly[]>(anomaliesQueryKey);

      if (previous) {
        queryClient.setQueryData<Anomaly[]>(anomaliesQueryKey, (old) =>
          old?.map((item) => (item.id === id ? { ...item, status: 'deploying' } : item)) ?? [],
        );
      }

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(anomaliesQueryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: anomaliesQueryKey });
    },
  });
};
