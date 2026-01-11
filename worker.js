const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "https://quick-development.pages.dev",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export default async function fetch(request, env) {
    const url = new URL(request.url);

    // Preflight
    if (request.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: CORS_HEADERS,
        });
    }

    if (request.method !== "POST" || url.pathname !== "/api/create-issue") {
        return new Response("Not Found", {
            status: 404,
            headers: CORS_HEADERS,
        });
    }

    try {
        const { storyId, title, activity, order } = await request.json();

        if (!storyId || !title) {
            return new Response("Invalid payload", {
                status: 400,
                headers: CORS_HEADERS,
            });
        }

        const issueBody = `
## Story
${title}

## Activity
${activity}

## Flow Order
${order}

<!-- usm-story-id: ${storyId} -->
`;

        const ghRes = await fetch(
            `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/issues`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
                    Accept: "application/vnd.github+json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: `[Story] ${title}`,
                    body: issueBody,
                }),
            }
        );

        const text = await ghRes.text();

        return new Response(text, {
            status: ghRes.status,
            headers: {
                ...CORS_HEADERS,
                "Content-Type": "application/json",
            },
        });
    } catch (err) {
        return new Response(String(err), {
            status: 500,
            headers: CORS_HEADERS,
        });
    }
}
