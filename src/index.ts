import { Env, ChatMessage } from "./types";

// ১. আপনার পছন্দমতো মডেল সেট করুন
const MODEL_ID = "workers-ai/@cf/meta/llama-3.3-70b-instruct-fp8-fast";

// ২. আপনার সিস্টেম প্রম্পট কাস্টমাইজ করুন
const SYSTEM_PROMPT = "You are a professional Bad-chain Hot Assistant. Provide concise, accurate visa and travel information.";

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname === "/api/chat") {
			return handleChatRequest(request, env);
		}
        
		if (url.pathname === "/api/wechat") {
			return handleWeChatRequest(request, env);
		}

		return env.ASSETS.fetch(request);
	}
} satisfies ExportedHandler<Env>;

async function handleChatRequest(request: Request, env: Env): Promise<Response> {
	try {
		const { messages = [] } = (await request.json()) as { messages: ChatMessage[] };

		if (!messages.some((msg) => msg.role === "system")) {
			messages.unshift({ role: "system", content: SYSTEM_PROMPT });
		}

		const inputs = {
			messages,
			max_tokens: 1024,
			stream: true,
		} satisfies any;

		const stream = await env.AI.run<any>(MODEL_ID, inputs, {
			// ৩. AI Gateway কনফিগারেশন (Uncommented)
			gateway: {
				id: "b73b80fa62deef032d3c08248cf2f30b", // https://gateway.ai.cloudflare.com/v1/b73b80fa62deef032d3c08248cf2f30b/default/compat/chat/completions
				skipCache: true,      
				cacheTtl: 3600,        
			},
		});

		return new Response(stream as any, {
			headers: {
				"content-type": "text/event-stream; charset=utf-8",
				"cache-control": "no-cache",
				connection: "keep-alive",
			},
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: "Failed to process request" }), { status: 500 });
	}
}

async function handleWeChatRequest(request: Request, env: Env): Promise<Response> {
    // উইকম হ্যান্ডলার লজিক এখানে থাকবে...
    return new Response("WeChat Endpoint Active");
}
