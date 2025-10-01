type Key = string;

type Bucket = {
    tokens: number;
    lastRefillMs: number;
};

const buckets = new Map<Key, Bucket>();

export function allowRequest(key: string, maxPerWindow: number, windowMs: number) {
    const now = Date.now();
    const ratePerMs = maxPerWindow / windowMs;
    const bucket = buckets.get(key) || { tokens: maxPerWindow, lastRefillMs: now };

    const elapsed = now - bucket.lastRefillMs;
    bucket.tokens = Math.min(maxPerWindow, bucket.tokens + elapsed * ratePerMs);
    bucket.lastRefillMs = now;

    if (bucket.tokens >= 1) {
        bucket.tokens -= 1;
        buckets.set(key, bucket);
        return true;
    }
    buckets.set(key, bucket);
    return false;
}


