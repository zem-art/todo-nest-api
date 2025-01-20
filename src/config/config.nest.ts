import { API_VERSION } from "src/common/constants/variable.constants";

// nest app intial
export default () => ({
    appExpress: {
      host: process.env.NEST_APP_URL_E || '127.0.0.1',
      port : process.env.NEST_APP_PORT_E || 3000,
      prefix : process.env.NEST_APP_PREFIX_E,
      version : process.env.NEST_APP_VERSION_E || API_VERSION,
      env : process.env.NEST_APP_ENV_E,
    },
    appFastify: {
      host: process.env.NEST_APP_URL_F || '127.0.1.1',
      port : process.env.NEST_APP_PORT_F || 4000,
      prefix : process.env.NEST_APP_PREFIX_F,
      version : process.env.NEST_APP_VERSION_F || API_VERSION,
      env : process.env.NEST_APP_ENV_F,
    },
});