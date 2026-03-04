class SlidingWindowLimiter {
  constructor(limit, windowMs) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.store = new Map();
  }

  hit(key) {
    const now = Date.now();
    const bucket = this.store.get(key) || [];
    const filtered = bucket.filter((value) => now - value < this.windowMs);
    filtered.push(now);
    this.store.set(key, filtered);
    return filtered.length <= this.limit;
  }
}

module.exports = SlidingWindowLimiter;
