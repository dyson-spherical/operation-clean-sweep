import type { HalLink } from '@/types';
import halClient from './halClient';

class HalNavigator {
  private links: Record<string, HalLink> = {};
  private loaded = false;

  public async initialize(): Promise<this> {
    if (!this.loaded) {
      try {
        const response = await halClient.get<{ _links: Record<string, HalLink> }>('/');
        this.links = response._links || {};
        this.loaded = true;
      } catch (error) {
        console.error('Failed to initialize HAL navigator:', error);
        throw error;
      }
    }
    return this;
  }

  public async followLink<T>(rel: string, params: Record<string, string> = {}): Promise<T> {
    await this.initialize();

    if (!this.links[rel]) {
      throw new Error(`Link relation "${rel}" not found`);
    }

    const href = this.links[rel].href;
    const url = this.expandUrl(href, params);

    return halClient.get<T>(url);
  }

  private expandUrl(template: string, params: Record<string, string>): string {
    let url = template;

    // Handle HAL URL templates
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`{${key}}`, encodeURIComponent(value));
    });

    return url;
  }

  public getLinks(): Record<string, HalLink> {
    return { ...this.links };
  }
}

export default new HalNavigator();
