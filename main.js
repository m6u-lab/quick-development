async function loadAndRender() {
    const res = await fetch("./data.json");
    const data = await res.json();

    const map = document.getElementById("map");
    map.innerHTML = "";

    data.activities
        .sort((a, b) => a.order - b.order)
        .forEach((activity) => {
            const activityEl = document.createElement("div");
            activityEl.className = "activity";

            const titleEl = document.createElement("div");
            titleEl.className = "activity-title";
            titleEl.textContent = activity.title;
            activityEl.appendChild(titleEl);

            const storiesEl = document.createElement("div");
            storiesEl.className = "stories";

            activity.stories
                .sort((a, b) => a.order - b.order)
                .forEach((story) => {
                    const storyEl = document.createElement("div");
                    storyEl.className = "story";

                    const storyTitle = document.createElement("div");
                    storyTitle.className = "story-title";
                    storyTitle.textContent = story.title;
                    storyEl.appendChild(storyTitle);

                    // --- Create Issue button ---
                    if (story.exportStatus !== "exported") {
                        const btn = document.createElement("button");
                        btn.className = "create-issue-btn";
                        btn.textContent = "Create Issue";

                        btn.addEventListener("click", async () => {
                            btn.disabled = true;
                            btn.textContent = "Creating...";

                            const res = await fetch("/api/create-issue", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    storyId: story.storyId,
                                    title: story.title,
                                    activity: activity.title,
                                    order: story.order
                                })
                            });

                            if (!res.ok) {
                                alert("Issue作成に失敗しました");
                                btn.disabled = false;
                                btn.textContent = "Create Issue";
                                return;
                            }

                            const result = await res.json();
                            console.log("Created:", result);

                            alert(`Issue #${result.issueNumber} を作成しました`);
                        });


                        storyEl.appendChild(btn);
                    }

                    storiesEl.appendChild(storyEl);
                });

            activityEl.appendChild(storiesEl);
            map.appendChild(activityEl);
        });
}

loadAndRender();
