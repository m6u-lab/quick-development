const data = {
    activities: [
        {
            name: "商品を探す",
            user_stories: [
                {
                    story: "商品を検索したい",
                    tasks: ["検索バー入力", "検索結果表示"]
                }
            ]
        }
    ]
};

const container = document.getElementById("map");

data.activities.forEach(activity => {
    const col = document.createElement("div");
    col.className = "activity";

    const title = document.createElement("h2");
    title.textContent = activity.name;
    col.appendChild(title);

    activity.user_stories.forEach(us => {
        const story = document.createElement("div");
        story.className = "story";
        story.textContent = us.story;
        col.appendChild(story);

        us.tasks.forEach(task => {
            const t = document.createElement("div");
            t.className = "task";
            t.textContent = task;
            col.appendChild(t);
        });
    });

    container.appendChild(col);
});
