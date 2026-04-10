const clientId = process.env.HELLOASSO_CLIENT_ID;
const clientSecret = process.env.HELLOASSO_CLIENT_SECRET;
const orgSlug = process.env.HELLOASSO_ORG_SLUG;

const tokenRes = await fetch('https://api.helloasso.com/oauth2/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ grant_type: 'client_credentials', client_id: clientId, client_secret: clientSecret }).toString(),
});
const { access_token } = await tokenRes.json();

const url = new URL(`https://api.helloasso.com/v5/organizations/${orgSlug}/forms`);
url.searchParams.set('pageSize', '50');
const res = await fetch(url, { headers: { Authorization: `Bearer ${access_token}` } });
const json = await res.json();

const forms = json.data ?? [];
console.log(`Total forms: ${forms.length}`);
forms.forEach(f =>
  console.log(`  [${f.formType}] ${f.title} | starts: ${f.startDate?.slice(0, 10) ?? 'n/a'} | state: ${f.state}`)
);
