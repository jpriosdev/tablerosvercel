const users = require('../lib/users');

const accounts = [
  { email: 'pilar.albacete@abstracta.us', password: 'Abstracta2026*', name: 'Pilar Albacete' },
  { email: 'crs@tiendas3b.com', password: 'T3b2026*', name: 'CRS Tiendas3B' },
  { email: 'juan.rios@abstracta.us', password: 'Colombia2026*', name: 'Juan Rios' }
];

(async () => {
  for (const acct of accounts) {
    try {
      const res = users.createUser(acct.email, acct.password, acct.name);
      if (res.ok) {
        console.log(`Created user: ${acct.email}`);
      } else {
        console.log(`Skipped ${acct.email}: ${res.reason}`);
      }
    } catch (e) {
      console.error(`Error creating ${acct.email}:`, e.message || e);
    }
  }
  console.log('Done. Users saved to data/users.json');
})();
