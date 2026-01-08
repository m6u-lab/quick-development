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

const map = document.getElementById("map");

data.activities.forEach(activity => {
    const activityEl = document.createElement("div");
    activityEl.className = "activity";

    const title = document.createElement("div");
    title.className = "activity-title";
    title.textContent = activity.name;
    activityEl.appendChild(title);

    const storiesEl = document.createElement("div");
    storiesEl.className = "stories";

    activity.user_stories.forEach(us => {
        const storyEl = document.createElement("div");
        storyEl.className = "story";

        const storyTitle = document.createElement("div");
        storyTitle.className = "story-title";
        storyTitle.textContent = us.story;
        storyEl.appendChild(storyTitle);

        const tasksEl = document.createElement("div");
        tasksEl.className = "tasks";

        us.tasks.forEach(task => {
            const taskEl = document.createElement("div");
            taskEl.className = "task";
            taskEl.textContent = task;
            tasksEl.appendChild(taskEl);
        });

        storyEl.appendChild(tasksEl);
        storiesEl.appendChild(storyEl);
    });

    activityEl.appendChild(storiesEl);
    map.appendChild(activityEl);
});
