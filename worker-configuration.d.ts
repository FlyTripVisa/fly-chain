// Worker-configuration.d.ts

/**
 * Cloudflare Worker Environment Configuration
 */
declare interface Env {
  // AI Binding
  readonly AI: Ai;
  
  // Static Assets Binding
  readonly ASSETS: Fetcher;
  
  // Environment Secrets
  readonly ACCESS_TOKEN: string;
  readonly WECHAT_CORP_ID?: string;
  readonly WECHAT_SECRET?: string;
}

// এই ডিক্লারেশনটি আপনার src/types.ts এর সাথে ম্যাপ করার জন্য
export {}; 
