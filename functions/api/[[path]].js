export async function onRequest({ request, env }) {
    if (!env.API) {
        return new Response("Service binding API not found", { status: 500 });
    }

    const res = await env.API.fetch(request);
    return res;
}
