export default class AxiosClient {
  constructor(axios) {
    this.axios = axios;
  }

  req(opts) {
    return this.axios(opts);
  }
}
