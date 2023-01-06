export interface Auth0Config {
  domain: string;
  audience: string;
  algorithms: string[];
}

export interface ConfigOptions {
  auth0: Auth0Config;
  opaUri: string;
}

const Config: ConfigOptions = {
  opaUri: process.env.OPA_URI || "http://localhost:8181/",
  auth0: {
    domain: process.env.AUTH0_DOMAIN
      ? process.env.AUTH0_DOMAIN
      : "acalla-demoapp.us.auth0.com",
    audience: process.env.AUTH0_AUDIENCE
      ? process.env.AUTH0_AUDIENCE
      : "https://demoapi.acalla.com/v1/",
    algorithms: ["RS256"],
  },
};


export default Config;
