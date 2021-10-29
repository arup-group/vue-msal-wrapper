export default {
  msalConfig: {
    auth: {
      clientId: "MSAL_AAD_CLIENT_ID",
      authority: "https://login.microsoftonline.com/MSAL_TENANT_ID",
      redirectUri: window.location.origin + "/login/aad",
    },
    cache: {
      cacheLocation: "sessionStorage",
      storeAuthStateInCookie: false,
    },
  },
  tokenTypes: {
    login: {
      scopes: ["User.Read"],
      extraScopesToConsent: [
        "https://api.domain.com/access_as_user",
        "https://another-api.onmicrosoft.com/user_impersonation",
      ],
    },
    api: {
      scopes: ["https://api.arup.com/access_as_user"],
    },
    anotherApi: {
      scopes: ["https://another-api.onmicrosoft.com/user_impersonation"],
    },
  },
};
