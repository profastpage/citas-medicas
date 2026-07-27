// Create a Clinic for the test user so we can verify /dashboard works
const { Client } = require('pg');

const DIRECT_URL = process.env.DIRECT_URL || '';
const m = DIRECT_URL.match(/^postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/);
const [, USER, PASSWORD, HOST, PORT_STR, DB] = m;

const client = new Client({
  host: HOST,
  port: parseInt(PORT_STR, 10),
  database: DB,
  user: USER,
  password: PASSWORD,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  await client.connect();
  console.log('✅ Connected');

  // Get the test user
  const user = await client.query(`
    SELECT id, email, full_name FROM public."User"
    WHERE email = 'direct-test+1785191030692@gmail.com';
  `);
  if (user.rows.length === 0) {
    console.log('❌ Test user not found');
    process.exit(1);
  }
  console.log('User:', user.rows[0]);

  const userId = user.rows[0].id;

  // Create a clinic for this user
  console.log('\n=== Creating Clinic ===');
  const clinic = await client.query(`
    INSERT INTO public."Clinic" (owner_id, name, slug, phone)
    VALUES ($1, 'Clínica Test Direct', 'clinica-test-direct', '+51 999 999 999')
    RETURNING id, name, slug;
  `, [userId]);
  console.log('Clinic created:', clinic.rows[0]);

  const clinicId = clinic.rows[0].id;

  // Add default specialties
  console.log('\n=== Adding default specialties ===');
  const specs = await client.query(`
    INSERT INTO public."Specialty" (clinic_id, name)
    VALUES ($1, 'Medicina General'), ($1, 'Pediatría'), ($1, 'Ginecología')
    RETURNING id, name;
  `, [clinicId]);
  console.log(`Added ${specs.rows.length} specialties`);

  // Add default services
  console.log('\n=== Adding default services ===');
  const services = await client.query(`
    INSERT INTO public."Service" (clinic_id, name, price, duration_min)
    VALUES
      ($1, 'Consulta Médica General', 50, 30),
      ($1, 'Consulta Pediátrica', 60, 30),
      ($1, 'Examen Físico', 40, 20)
    RETURNING id, name;
  `, [clinicId]);
  console.log(`Added ${services.rows.length} services`);

  // Verify
  console.log('\n=== Verification ===');
  const verify = await client.query(`
    SELECT
      (SELECT COUNT(*) FROM public."Clinic" WHERE owner_id = $1) AS clinics,
      (SELECT COUNT(*) FROM public."Specialty" WHERE clinic_id = $2) AS specialties,
      (SELECT COUNT(*) FROM public."Service" WHERE clinic_id = $2) AS services;
  `, [userId, clinicId]);
  console.log('Counts:', verify.rows[0]);

  await client.end();
  console.log('\n✅ Done — /dashboard should work now');
}

main().catch((e) => {
  console.error('💥', e.message);
  process.exit(1);
});
