import halClient from '@/services/api/halClient';
import halNavigator from '@/services/api/halNavigator';
import type { HalCollection, User } from '@/types';

class UserService {
  public async getUsers(page = 0, size = 20): Promise<HalCollection<User>> {
    return halNavigator.followLink<HalCollection<User>>('users', { 
      page: page.toString(), 
      size: size.toString() 
    });
  }

  public async getUser(id: string): Promise<User> {
    return halClient.get<User>(`/users/${id}`);
  }

  public async getCurrentUserProfile(): Promise<User> {
    return halClient.get<User>('/users/me');
  }

  public async updateUser(id: string, user: Partial<User>): Promise<User> {
    return halClient.patch<User>(`/users/${id}`, user);
  }

  public async updatePreferences(id: string, preferences: Partial<User['preferences']>): Promise<User> {
    return halClient.patch<User>(`/users/${id}/preferences`, preferences);
  }
}

export default new UserService();
