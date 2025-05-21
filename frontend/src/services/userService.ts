import type { User } from '@/types';
import type { AxiosResponse } from 'axios';
import halClient from './api/halClient';

class UserService {
    async getCurrentUser(): Promise<User> {
        const response: AxiosResponse<User> = await halClient.get('/api/users/me');
        return response.data;
    }

    async updatePreferences(preferences: User['preferences']): Promise<User> {
        const response: AxiosResponse<User> = await halClient.put('/api/users/me/preferences', preferences);
        return response.data;
    }
}

export const userService = new UserService();