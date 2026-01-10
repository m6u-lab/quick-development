export async function onRequest({ request, env }) {
    const url = new URL(request.url);

    // Pages の /api/xxx → Worker の /api/xxx に転送
    const workerUrl = new URL(url.pathname, "http://worker");
    workerUrl.search = url.search;

    return env.API.fetch(workerUrl.toString(), request);
}
