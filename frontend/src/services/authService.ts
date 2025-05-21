// src/services/authService.ts
import { userService } from '@/services/userService';
import type { User } from '@/types';
import { Role } from '@/types';
import { User as OidcUser, UserManager, WebStorageStateStore } from 'oidc-client-ts';

// OIDC Configuration
const oidcConfig = {
    authority: import.meta.env.VITE_AUTHENTIK_URL,
    client_id: import.meta.env.VITE_AUTHENTIK_CLIENT_ID,
    redirect_uri: `${window.location.origin}/callback`,
    post_logout_redirect_uri: window.location.origin,
    response_type: 'code',
    scope: 'openid profile email',
    // automaticSilentRenew: true,
    // silent_redirect_uri: `${window.location.origin}/silent-refresh.html`,
    userStore: new WebStorageStateStore({ store: localStorage }),
    metadata: {
        authorization_endpoint: "https://sso.upliftlunar.rocks/application/o/authorize/",
        issuer: "https://sso.upliftlunar.rocks/application/o/tasktide/",
        jwks_uri: "https://sso.upliftlunar.rocks/application/o/tasktide/jwks/",
        token_endpoint: "https://sso.upliftlunar.rocks/application/o/token/",
        userinfo_endpoint: "https://sso.upliftlunar.rocks/application/o/userinfo/"
    }
};

class AuthService {
    private userManager: UserManager;
    private currentUser: User | null = null;

    constructor() {
        this.userManager = new UserManager(oidcConfig);

        // Set up event listeners
        this.userManager.events.addUserLoaded(this.onUserLoaded.bind(this));
        this.userManager.events.addSilentRenewError(this.onSilentRenewError.bind(this));
        this.userManager.events.addAccessTokenExpired(this.onAccessTokenExpired.bind(this));

        // Try to load user from storage on initialization
        this.loadUser();
    }

    private async loadUser(): Promise<void> {
        try {
            const oidcUser = await this.userManager.getUser();
            if (oidcUser && !oidcUser.expired) {
                await this.processOidcUser(oidcUser);
            }
        } catch (error) {
            console.error('Failed to load user from storage:', error);
        }
    }

    private onUserLoaded(oidcUser: OidcUser): void {
        this.processOidcUser(oidcUser);
    }

    private onSilentRenewError(error: Error): void {
        console.error('Silent token renewal failed:', error);
        // Optionally redirect to login if silent renewal fails
    }

    private onAccessTokenExpired(): void {
        console.log('Access token expired, attempting silent renewal');
        this.userManager.signinSilent().catch(error => {
            console.error('Silent renewal failed after token expiration:', error);
            // Redirect to login if needed
            this.login();
        });
    }

    private async processOidcUser(oidcUser: OidcUser): Promise<void> {
        try {
            // Get or create user from backend
            const user = await userService.getCurrentUser();
            this.currentUser = user;

            // Store the token for API calls
            localStorage.setItem('auth_token', oidcUser.access_token);
            localStorage.setItem('current_user', JSON.stringify(this.currentUser));
        } catch (error) {
            console.error('Failed to process user:', error);
            throw error;
        }
    }

    private extractRoles(oidcUser: OidcUser): Role[] {
        // Extract roles from Authentik claims
        // The exact claim name depends on your Authentik configuration
        const roleClaims = oidcUser.profile.roles ||
            oidcUser.profile.groups ||
            oidcUser.profile['authentik:groups'] ||
            [];

        const roles: Role[] = [];

        // Map Authentik roles to your application roles
        if (Array.isArray(roleClaims)) {
            if (roleClaims.includes('Admin')) roles.push(Role.ADMINISTRATOR);
            if (roleClaims.includes('Family')) roles.push(Role.WORKER);
            if (roleClaims.includes('chores_verifier')) roles.push(Role.VERIFIER);
        }

        return roles;
    }

    public async login(): Promise<void> {
        await this.userManager.signinRedirect();
    }

    public async handleCallback(): Promise<User | null> {
        try {
            const oidcUser = await this.userManager.signinRedirectCallback();
            await this.processOidcUser(oidcUser);
            return this.currentUser;
        } catch (error) {
            console.error('Error handling callback:', error);
            return null;
        }
    }

    public async logout(): Promise<void> {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
        this.currentUser = null;
        await this.userManager.signoutRedirect();
    }

    public isAuthenticated(): boolean {
        return !!this.currentUser;
    }

    public getCurrentUser(): User | null {
        return this.currentUser;
    }

    public hasRole(role: Role): boolean {
        return this.currentUser?.roles.includes(role) || false;
    }

    public getAccessToken(): string | null {
        return localStorage.getItem('auth_token');
    }
}

export default new AuthService();
