interface QueuedRequest<T> {
  execute: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (error: any) => void;
}

class RateLimiter {
  private queue: QueuedRequest<any>[] = [];
  private isProcessing = false;
  private readonly delayMs: number;

  constructor(delayMs: number = 1000) {
    this.delayMs = delayMs;
  }

  async addToQueue<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({
        execute: requestFn,
        resolve,
        reject,
      });

      // Start processing if not already running
      if (!this.isProcessing) {
        this.processQueue();
      }
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const request = this.queue.shift()!;

      try {
        const result = await request.execute();
        request.resolve(result);
      } catch (error) {
        request.reject(error);
      }

      // Wait before processing next request (if there is one)
      if (this.queue.length > 0) {
        await this.delay(this.delayMs);
      }
    }

    this.isProcessing = false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Create a singleton instance for Nominatim requests
export const nominatimRateLimiter = new RateLimiter(1000); // 1 second delay
