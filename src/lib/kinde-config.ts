// Kinde configuration
export const kindeConfig = {
  clientId: 'b6a6ec27637d4aa09c4e0e59992426da',
  clientSecret: 'your_client_secret_here',
  issuerUrl: 'https://jbtest001.kinde.com',
  siteUrl: 'http://localhost:3000',
  postLogoutRedirectUrl: 'http://localhost:3000'
};

// Set environment variables
process.env.KINDE_CLIENT_ID = kindeConfig.clientId;
process.env.KINDE_CLIENT_SECRET = kindeConfig.clientSecret;
process.env.KINDE_ISSUER_URL = kindeConfig.issuerUrl;
process.env.KINDE_SITE_URL = kindeConfig.siteUrl;
process.env.KINDE_POST_LOGOUT_REDIRECT_URL = kindeConfig.postLogoutRedirectUrl;
