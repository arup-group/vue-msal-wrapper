import axios from "axios";
import { PublicClientApplication } from "@azure/msal-browser";
import msalWrapper from "./msalWrapper.vue";

class msalAuthHandler {
  constructor() {
    this.tokenTypes = {};
    this.currentUser = {};
    this.tokenStore = {};
    this.excludeRoutes = [];
    this.msalInstance = null;
  }

  install(Vue, options) {
    Vue.msalAuthHandler = this;
    Vue.prototype.$msal = this;
    this.msalInstance = new PublicClientApplication(options.msalConfig);
    this.tokenTypes = options.tokenTypes || {};
    this.excludeRoutes = options.excludeRoutes || [];
    Vue.component("msal-wrapper", msalWrapper);
  }

  setToken(tokenType, response) {
    const expirationOffset = 10000000;
    const expiration =
      response.expiresOn.getTime() - new Date().getTime() - expirationOffset;
    this.tokenStore[tokenType] = response.accessToken;
    const that = this;
    window.setTimeout(async function () {
      that.getAuthToken(tokenType);
    }, expiration);
  }

  inIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  getAuthToken(tokenType) {
    const that = this;
    return new Promise(async function (resolve) {
      await that.msalInstance
        .acquireTokenSilent({
          ...that.tokenTypes[tokenType],
          account: that.msalInstance.getAllAccounts()[0],
        })
        .then((response) => {
          that.setToken(tokenType, response);
          resolve();
        })
        .catch((err) => {
          if (err.name === "InteractionRequiredAuthError") {
            let tokenFn = that.msalInstance.acquireTokenRedirect
            if (that.inIframe()) {
              tokenFn = that.msalInstance.acquireTokenPopup
            }
            return tokenFn({
              ...that.tokenTypes[tokenType],
              account: that.msalInstance.getAllAccounts()[0],
            })
              .then((response) => {
                that.setToken(tokenType, response);
                resolve();
              })
              .catch((err) => {
                console.error(err);
              });
          }
        });
    });
  }

  authenticatedApi(baseURL, tokenType, additionalHeaders = {}) {
    const tokenStore = this.tokenStore;
    let http = axios.create({
      baseURL: baseURL,
      withCredentials: false,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    http.interceptors.request.use(function (config) {
      if (tokenStore[tokenType]) {
        config.headers["Authorization"] = `Bearer ${tokenStore[tokenType]}`;
        Object.assign(config.headers, additionalHeaders);
      }
      return config;
    });
    return http;
  }

  login() {
    if (this.inIframe()) {
      this.msalInstance.loginPopup(this.tokenTypes["login"]);
    } else {
      this.msalInstance.loginRedirect(this.tokenTypes["login"]);
    }
  }

  getUser() {
    return this.currentUser;
  }

  setUser(user) {
    this.currentUser = user;
  }
}

export default new msalAuthHandler();
