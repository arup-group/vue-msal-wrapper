# vue-msal-apitokens

Vue package to authenticate with msal and provides a generic api bearer token wrapper

## Usage

Inside the Vue `main.js` put the following:

```
import msalAuthHandler from "vue-msal-wrapper";
import authConfig from "@/authConfig";
Vue.use(msalAuthHandler, authConfig);
```

Create an authConfig.js in the same folder based on authConfig.example.js

To trigger auto-login and prevent components/routing elements from being called lnstall the `<msal-wrapper></msal-wrapper>` tag in the App.vue file.

Manual login/logout functionality is coming soon.

### Dev / Build

Install required packages with `npm install`

To build for packaging use: `npm run bundle`

## Authors

- Ben Hussey
