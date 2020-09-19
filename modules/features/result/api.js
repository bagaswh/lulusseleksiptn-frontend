import apiRequest from '~/modules/core/api';

export async function all(client, params = {}) {
  return (await apiRequest(client, { url: 'result', ...params })).data;
}

export async function search(client, params = {}) {
  return (await apiRequest(client, { url: 'result/search', ...params })).data;
}
