import { fetchAnomalies } from '@/shared/api/anomaly';
import type { Anomaly } from '../model/types';

export const getAnomalies = async (): Promise<Anomaly[]> => fetchAnomalies();
