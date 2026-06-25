import { Env, ChatMessage } from "./types";

const MODEL_ID = "@cf/meta/llama-3.1-8b-instruct-fp8";

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const url = new URL(request.url);

        // ১. ওয়েব চ্যাট রিকোয়েস্ট (Frontend API)
        if (url.pathname === "/api/chat") {
            return handleChatRequest(request, env);
        }

        // ২. উইকম রোবট রিকোয়েস্ট (WeChat Work)
        if (url.pathname === "/api/wechat") {
            return handleWeChatRequest(request, env);
        }

        // ৩. স্ট্যাটিক ফাইল সার্ভিং
        return env.ASSETS.fetch(request);
    }
} satisfies ExportedHandler<Env>;

// আপনার আগের ChatRequest ফাংশনটি এখানে থাকবে...
async function handleChatRequest(request: Request, env: Env): Promise<Response> {
    // ... SSE Streaming Logic ...
}

// উইকম হ্যান্ডলার
async function handleWeChatRequest(request: Request, env: Env): Promise<Response> {
    const data = await request.json();
    // উইকম মেসেজ প্রসেসিং লজিক এখানে বসান
    return new Response(JSON.stringify({ reply: "WeCom Bot Active" }));
}
