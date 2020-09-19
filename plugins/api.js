import AxiosClient from '~/modules/core/axios';
import * as result from '~/modules/features/result/api';

function createApiPlugin(context, api) {
  const plugin = {};
  const axios = new AxiosClient(context.$axios);
  Object.keys(api).forEach((key) => {
    plugin[key] = function (...args) {
      return api[key](axios, ...args);
    };
  });
  return plugin;
}

export default (context, inject) => {
  const api = {
    result: createApiPlugin(context, result),
  };
  inject('api', api);
};
