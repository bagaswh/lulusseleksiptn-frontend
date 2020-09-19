export default function apiRequest(client, opts = {}) {
  const url = `${process.env.BASE_API_URL}/api/${opts.url}`;
  return client.req({ ...opts, url });
}
