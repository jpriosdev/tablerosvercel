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

export async function getServerSideProps(context) {
  // protect this page by checking the signed session cookie
  const { getUserFromRequest } = await import('../lib/auth');
  const user = await getUserFromRequest(context.req);
  if (!user) {
    return {
      redirect: {
        destination: '/api/auth/login',
        permanent: false,
      },
    };
  }

  return { props: {} };
}

