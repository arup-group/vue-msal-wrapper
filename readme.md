# vue-msal-apitokens

Vue package to authenticate with msal and provides a generic api bearer token wrapper

## Usage

Inside the Vue `main.js` put the following:

```
import msalAuthHandler from "vue-msal-wrapper";
import authConfig from "@/authConfig";
Vue.use(msalAuthHandler, authConfig);
```

Create an authConfig.js in the same folder based on authConfig.example.js - note there must always be a login tokenType with scopes defined.

To trigger auto-login and prevent components/routing elements from being called lnstall the `<msal-wrapper></msal-wrapper>` tag in the App.vue file.

Manual login/logout functionality is coming soon.

To create an axios instance containing the Bearer tokens use `msalAuthHandler.authenticatedApi("BASEURL", "TOKENNAME");` where BASEURL is the API url and TOKENNAME is the corresponding key.

An example for Microsoft Graph as a Vue plugin:

```
import msalAuthHandler from "vue-msal-wrapper";

export const GraphAuth = {
  install(Vue, router, opts = {}) {
    Vue.prototype.$graph = msalAuthHandler.authenticatedApi(
      "https://graph.microsoft.com",
      "graph"
    );
  },
};
```

To get the current user name (or other information passed by MSAL) in a Vue view, use:

```
return this.$msal.getUser().name || "Not logged in.";
```

The API constructor also accepts a third parameter to pass additional headers to Axios e.g.

```
msalAuthHandler.authenticatedApi(
    process.env.VUE_APP_API_URI,
    "api",
    { "Subscription-Key": process.env.VUE_APP_API_KEY }
);
```

### Dev / Build

Install required packages with `npm install`

To build for packaging use: `npm run bundle`

## Authors

- Ben Hussey
