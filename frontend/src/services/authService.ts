// src/services/authService.ts
import { oidcConfig } from '@/config/oidc';
import type { User } from '@/types';
import { Role } from '@/types';
import { User as OidcUser, UserManager } from 'oidc-client-ts';

class AuthService {
    private userManager: UserManager;
    private currentUser: User | null = null;
    private isInitialized: boolean = false;
    private initializationPromise: Promise<void> | null = null;

    constructor() {
        this.userManager = new UserManager(oidcConfig);

        // Set up event listeners
        this.userManager.events.addUserLoaded(this.onUserLoaded.bind(this));
        this.userManager.events.addAccessTokenExpired(this.onAccessTokenExpired.bind(this));
        this.userManager.events.addSilentRenewError(this.onSilentRenewError.bind(this));
        this.userManager.events.addUserUnloaded(this.onUserUnloaded.bind(this));

        // Initialize auth state
        this.initializationPromise = this.initialize();
    }

    private async initialize(): Promise<void> {
        if (this.isInitialized) return;

        try {
            await this.loadUser();
            this.isInitialized = true;
        } catch (error) {
            console.error('Failed to initialize auth service:', error);
            throw error;
        }
    }

    private onUserLoaded(oidcUser: OidcUser): void {
        this.processOidcUser(oidcUser);
    }

    private onUserUnloaded(): void {
        this.currentUser = null;
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
    }

    private onSilentRenewError(error: Error): void {
        this.currentUser = null;
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
    }

    private onAccessTokenExpired(): void {
        this.currentUser = null;
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
    }

    private async processOidcUser(oidcUser: OidcUser): Promise<void> {
        localStorage.setItem('auth_token', oidcUser.access_token);

        try {
            const response = await fetch('/api/users/me', {
                headers: {
                    'Authorization': `Bearer ${oidcUser.access_token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to get user profile: ${response.statusText}`);
            }

            const user = await response.json();
            this.currentUser = user;
            localStorage.setItem('current_user', JSON.stringify(user));
        } catch (error) {
            this.currentUser = null;
            localStorage.removeItem('auth_token');
            localStorage.removeItem('current_user');
        }
    }

    private async loadUser(): Promise<void> {
        try {
            const oidcUser = await this.userManager.getUser();

            if (oidcUser) {
                if (oidcUser.expired) {
                    this.currentUser = null;
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('current_user');
                } else {
                    await this.processOidcUser(oidcUser);
                }
            }
        } catch (error) {
            this.currentUser = null;
            localStorage.removeItem('auth_token');
            localStorage.removeItem('current_user');
        }
    }

    private extractRoles(oidcUser: OidcUser): Role[] {
        // Extract roles from Authentik claims
        // The exact claim name depends on your Authentik configuration
        const roleClaims = oidcUser.profile.entitlements || oidcUser.profile.roles ||
            oidcUser.profile.groups ||
            oidcUser.profile['authentik:groups'] ||
            [];

        console.log('Authentik role claims:', roleClaims);
        console.log('Authentik profile:', oidcUser.profile);

        const roles: Role[] = [];

        // Map Authentik roles to your application roles
        if (Array.isArray(roleClaims)) {
            if (roleClaims.includes('ADMIN')) roles.push(Role.ADMIN);
            if (roleClaims.includes('WORKER')) roles.push(Role.WORKER);
            if (roleClaims.includes('VERIFIER')) roles.push(Role.VERIFIER);
        }

        console.log('Mapped roles:', roles);
        return roles;
    }

    public getAccessToken(): string | null {
        return localStorage.getItem('auth_token');
    }

    public getCurrentUser(): User | null {
        return this.currentUser;
    }

    public async isAuthenticated(): Promise<boolean> {
        if (!this.isInitialized && this.initializationPromise) {
            await this.initializationPromise;
        }

        const hasToken = !!localStorage.getItem('auth_token');
        const hasUser = !!this.currentUser;
        return hasToken && hasUser;
    }

    public hasRole(role: Role): boolean {
        console.log('Checking role:', role);
        console.log('User roles:', this.currentUser?.roles);
        const hasRole = this.currentUser?.roles.includes(role) ?? false;
        console.log('Has role:', hasRole);
        return hasRole;
    }

    public async login(): Promise<void> {
        await this.userManager.signinRedirect();
    }

    public async handleCallback(): Promise<void> {
        try {
            const user = await this.userManager.signinRedirectCallback();
            await this.processOidcUser(user);
        } catch (error) {
            throw error;
        }
    }

    public async logout(): Promise<void> {
        await this.userManager.signoutRedirect();
    }
}

export default new AuthService();
