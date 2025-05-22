import { WebStorageStateStore } from 'oidc-client-ts';

// OIDC Configuration
export const oidcConfig = {
    authority: import.meta.env.VITE_AUTHENTIK_URL,
    client_id: import.meta.env.VITE_AUTHENTIK_CLIENT_ID,
    redirect_uri: `${window.location.origin}/callback`,
    post_logout_redirect_uri: window.location.origin,
    response_type: 'code',
    scope: 'openid profile email offline_access entitlements',
    userStore: new WebStorageStateStore({ store: localStorage }),
    metadata: {
        authorization_endpoint: "https://sso.upliftlunar.rocks/application/o/authorize/",
        issuer: "https://sso.upliftlunar.rocks/application/o/tasktide/",
        jwks_uri: "https://sso.upliftlunar.rocks/application/o/tasktide/jwks/",
        token_endpoint: "https://sso.upliftlunar.rocks/application/o/token/",
        userinfo_endpoint: "https://sso.upliftlunar.rocks/application/o/userinfo/"
    }
};