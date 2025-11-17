// pages/qa-dashboard.js
import ExecutiveDashboard from '../components/ExecutiveDashboard';

export default function QADashboardPage() {
  return (
    <ExecutiveDashboard 
      dataSource="/api/qa-data"
      configSource="/api/config"
      refreshInterval={300000}
    />
  );
}

