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
                    storiesEl.appendChild(storyEl);
                });

            activityEl.appendChild(storiesEl);
            map.appendChild(activityEl);
        });
}

loadAndRender();
