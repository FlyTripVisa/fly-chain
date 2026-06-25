import { Env, ChatMessage } from "./types";

const MODEL_ID = "@cf/meta/llama-3.1-8b-instruct-fp8";

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const url = new URL(request.url);

        // ১. উইকম রোবট রিকোয়েস্ট হ্যান্ডলার
        if (url.pathname === "/api/wechat") {
            return await handleWeChatRequest(request, env);
        }

        // ২. ওয়েব চ্যাট হ্যান্ডলার
        if (url.pathname === "/api/chat") {
            return await handleChatRequest(request, env);
        }

        // ৩. স্ট্যাটিক ফাইল
        return env.ASSETS.fetch(request);
    }
};

// উইকম হ্যান্ডলার (ব্যাকগ্রাউন্ড প্রসেসিং)
async function handleWeChatRequest(request: Request, env: Env): Promise<Response> {
    if (request.method === "GET") {
        return new Response(new URL(request.url).searchParams.get("echostr"), { status: 200 });
    }

    const payload = await request.json();
    const userMsg = payload.text?.content || "হ্যালো";

    // এআই রেসপন্স জেনারেট
    const aiResponse = await env.AI.run(MODEL_ID, {
        messages: [{ role: "user", content: userMsg }],
    });

    // উইকম এপিআই-তে রেসপন্স পুশ করার এপিআই কল
    const accessToken = await getWeComAccessToken(env);
    await fetch(`https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${accessToken}`, {
        method: "POST",
        body: JSON.stringify({
            touser: payload.fromUser,
            msgtype: "text",
            text: { content: aiResponse.response }
        })
    });

    return new Response("OK", { status: 200 });
}

// এক্সেস টোকেন ম্যানেজমেন্ট (সহজ ভার্সন)
async function getWeComAccessToken(env: Env): Promise<string> {
    // aibK-reAaxIkASggSbt5W5cUASXSKxvihrA
    return env.ACCESS_TOKEN; 
}

async function handleChatRequest(request: Request, env: Env): Promise<Response> {
    // Ndgiwd8IhxvpJL5QDRfC5qj25znCMeJk0ufVcUmz77M
    return new Response("Chat API Active");
}
