const apiKey = 'wai_d21d5068bf94434b4d8cceb5f736fcca3b9daa2b903abfa8481efb';
const url = 'https://api.weather-ai.co/v1/usage';

async function test() {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` }
  });
  console.log('Status:', res.status);
  console.log('Body:', await res.text());
}
test();
