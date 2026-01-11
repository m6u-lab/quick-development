export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        console.log("REQ", request.method, url.pathname);

        // POST /api/create-issue 以外は拒否
        if (request.method !== "POST" || url.pathname !== "/api/create-issue") {
            console.log("REJECTED: invalid method or path");
            return new Response("Not Found", { status: 404 });
        }

        try {
            const payload = await request.json();
            console.log("PAYLOAD", payload);

            const { storyId, title, activity, order } = payload;

            if (!storyId || !title) {
                console.log("INVALID PAYLOAD");
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

            console.log(
                "CALL GITHUB API",
                `${env.GITHUB_OWNER}/${env.GITHUB_REPO}`
            );

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

            console.log("GITHUB STATUS", ghRes.status);

            const text = await ghRes.text();
            console.log("GITHUB BODY", text);

            if (!ghRes.ok) {
                return new Response(
                    JSON.stringify({
                        error: "GitHub API error",
                        status: ghRes.status,
                        body: text
                    }),
                    {
                        status: 500,
                        headers: { "Content-Type": "application/json" }
                    }
                );
            }

            return new Response(text, {
                headers: { "Content-Type": "application/json" }
            });

        } catch (err) {
            console.log("EXCEPTION", err);
            return new Response(String(err), { status: 500 });
        }
    }
};
