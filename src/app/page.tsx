import { getAnomalies } from "@/entities/anomaly/api";
import { HomePage } from "@/pages/home";

export default async function Page() {
  const anomalies = await getAnomalies();
  const now = new Date().toISOString();

  return <HomePage anomalies={anomalies} lastUpdated={now} />;
}
