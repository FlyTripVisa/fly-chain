import { Env } from "./types";

const MODEL_ID = "@cf/meta/llama-3.1-8b-instruct-fp8";

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const url = new URL(request.url);

        if (url.pathname === "/api/wechat") return await handleWeChatRequest(request, env);
        if (url.pathname === "/api/chat") return await handleChatRequest(request, env);

        return env.ASSETS.fetch(request);
    }
};

async function handleWeChatRequest(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === "GET") return new Response(url.searchParams.get("echostr"), { status: 200 });

    const payload = await request.json();
    const userMsg = payload.text?.content || "হ্যালো";

    const aiResponse: any = await env.AI.run(MODEL_ID, {
        messages: [{ role: "user", content: userMsg }],
    });

    await fetch(`https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${env.ACCESS_TOKEN}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            touser: payload.fromUser,
            msgtype: "text",
            text: { content: aiResponse.response }
        })
    });

    return new Response("OK", { status: 200 });
}

async function handleChatRequest(request: Request, env: Env): Promise<Response> {
    return new Response("Chat API Active");
}
