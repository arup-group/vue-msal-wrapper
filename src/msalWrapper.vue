<template>
  <div v-if="authenticated"><slot></slot></div>
</template>

<script>
export default {
  data: () => ({ authenticated: false }),
  methods: {
    async handleResponse(resp) {
      if (resp !== null) {
        this.$msal.setUser(resp.account);
      } else {
        const currentAccounts = this.$msal.msalInstance.getAllAccounts();
        if (!currentAccounts || currentAccounts.length < 1) {
          this.$msal.msalInstance.loginRedirect(this.$msal.tokenTypes["login"]);
        } else if (currentAccounts.length === 1) {
          this.$msal.setUser(currentAccounts[0]);
        }
      }
      for (const tokenType of Object.keys(this.$msal.tokenTypes)) {
        await this.$msal.getAuthToken(tokenType);
      }
      this.authenticated = true;
    },
  },
  mounted() {
    this.$msal.msalInstance.handleRedirectPromise().then(this.handleResponse);
  },
};
</script>
