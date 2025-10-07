interface CacheItem<T> {
    data: T;
    expiry: number;
}

class MemoryCache {
    private cache: Map<string, CacheItem<any>>;

    constructor() {
        this.cache = new Map();
    }

    get<T>(key: string): T | null {
        const item = this.cache.get(key);

        if (!item) {
            return null;
        }

        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return null;
        }

        return item.data as T;
    }

    set<T>(key: string, data: T, ttlSeconds: number = 300): void {
        const cacheItem: CacheItem<T> = {
            data,
            expiry: ttlSeconds === -1 ? Number.MAX_SAFE_INTEGER : Date.now() + (ttlSeconds * 1000)
        };

        this.cache.set(key, cacheItem);
    }

    delete(key: string): boolean {
        return this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }

    deletePattern(pattern: string): number {
        let deleted = 0;
        const regex = new RegExp(pattern.replace('*', '.*'));

        for (const key of this.cache.keys()) {
            if (regex.test(key)) {
                this.cache.delete(key);
                deleted++;
            }
        }

        return deleted;
    }

    getStats() {
        const now = Date.now();
        let validItems = 0;
        let expiredItems = 0;

        for (const [key, item] of this.cache.entries()) {
            if (now > item.expiry) {
                expiredItems++;
            } else {
                validItems++;
            }
        }

        return {
            totalItems: this.cache.size,
            validItems,
            expiredItems
        };
    }
}

const memoryCache = new MemoryCache();

export default memoryCache;

// Helper function for consistent cache key generation
export const CacheKeys = {
    SITE_SETTINGS: 'site:settings',
    SECTION: (type: string) => `section:${type}`,
    ALL_SECTIONS: 'section:*',
};