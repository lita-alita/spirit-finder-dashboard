import { deploySquadToAnomaly, listAnomalies } from './anomaly.store';
import { anomaliesSchema } from './anomaly.schema';

export const fetchAnomalies = async () => {
  const data = await listAnomalies();
  const validated = anomaliesSchema.parse(data);
  await new Promise((resolve) => setTimeout(resolve, 150));
  return validated;
};

export const deploySquad = async (id: string) => {
  await deploySquadToAnomaly(id);
  return { id };
};
