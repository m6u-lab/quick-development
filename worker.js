export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // POST /api/create-issue 以外は拒否
        if (request.method !== "POST" || url.pathname !== "/api/create-issue") {
            return new Response("Not Found", { status: 404 });
        }

        try {
            const { storyId, title, activity, order } = await request.json();

            if (!storyId || !title) {
                return new Response("Invalid payload", { status: 400 });
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
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        title: `[Story] ${title}`,
                        body: issueBody
                    })
                }
            );

            const text = await ghRes.text();

            if (!ghRes.ok) {
                return new Response(text, { status: 500 });
            }

            return new Response(text, {
                headers: { "Content-Type": "application/json" }
            });

        } catch (err) {
            return new Response(String(err), { status: 500 });
        }
    }
};
