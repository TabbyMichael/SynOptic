const apiKey = 'wai_d21d50711910609341490278789518882518';
const url = 'https://api.weather-ai.co/v1/usage';

async function test() {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` }
  });
  console.log('Status:', res.status);
  console.log('Body:', await res.text());
}
test();
