<template>
  <div>
    <div v-if="showContent"><slot></slot></div>
    <div v-else></div>
  </div>
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
          this.$msal.login();
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
  computed: {
    showContent() {
      if (!this.$msal.excludeRoutes.includes(this.$route.name)) {
        if (this.authenticated) {
          return true;
        } else {
          return false;
        }
      }
      return true;
    },
  },
  mounted() {
    if (!this.$msal.excludeRoutes.includes(this.$route.name)) {
      this.$msal.msalInstance.handleRedirectPromise().then(this.handleResponse);
    }
  },
  beforeRouteUpdate(to) {
    if (!this.$msal.excludeRoutes.includes(to.name)) {
      this.$msal.msalInstance.handleRedirectPromise().then(this.handleResponse);
    }
  },
};
</script>
