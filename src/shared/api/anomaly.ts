import { anomaliesMock } from './mocks/anomalies';
import { anomaliesSchema } from './anomaly.schema';

export const fetchAnomalies = async () => {
  const validated = anomaliesSchema.parse(anomaliesMock);
  await new Promise((resolve) => setTimeout(resolve, 150));
  return validated;
};
