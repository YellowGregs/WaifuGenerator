const default_tags = {
  sfw: ["waifu", "maid", "marin-kitagawa", "mori-calliope", "raiden-shogun", "oppai", "selfies", "uniform"],
  nsfw: ["ass", "hentai", "milf", "oral", "paizuri", "ecchi", "ero"]
};

const mode_select = document.getElementById("mode_select");
const tag_select = document.getElementById("tag_select");
const refresh_button = document.getElementById("refresh_button");
const status_line = document.getElementById("status_line");
const result_image = document.getElementById("result_image");
const source_link = document.getElementById("source_link");
const tags_container = document.getElementById("tags_container");
const load_bar = document.getElementById("load_bar");

function update_tag_options() {
  const active_tags = default_tags[mode_select.value];
  tag_select.innerHTML = "";

  for (const tag_name of active_tags) {
    const option = document.createElement("option");
    option.value = tag_name;
    option.textContent = tag_name;
    tag_select.appendChild(option);
  }
}

function render_tag_chips(tags) {
  tags_container.innerHTML = "";
  for (const tag_item of tags) {
    const chip = document.createElement("span");
    chip.className = "tag-chip";
    chip.textContent = tag_item.name;
    tags_container.appendChild(chip);
  }
}

async function fetch_image() {
  const active_mode = mode_select.value;
  const selected_tag = tag_select.value;
  const is_nsfw = active_mode === "nsfw" ? "True" : "False";
  const url = `https://api.waifu.im/images?IncludedTags=${encodeURIComponent(selected_tag)}&IsNsfw=${is_nsfw}`;

  refresh_button.disabled = true;
  result_image.classList.add("is-loading");
  status_line.textContent = "Loading artwork...";
  status_line.classList.remove("status-error");
  load_bar.classList.add("is-active");

  try {
    const response = await fetch(url, {
      headers: {
        "Accept-Version": "v7"
      }
    });
    if (!response.ok) {
      throw new Error(`Request failed with ${response.status}`);
    }

    const payload = await response.json();
    const image_item = payload.items?.[0];
    if (!image_item?.url) {
      throw new Error("No image returned for this tag");
    }

    await preload_image(image_item.url);
    result_image.src = image_item.url;
    result_image.alt = `${selected_tag} artwork from waifu.im`;
    source_link.href = image_item.source || image_item.url;
    render_tag_chips(image_item.tags || []);
    status_line.textContent = `Showing ${selected_tag} in ${active_mode.toUpperCase()} mode.`;
  } catch (error) {
    status_line.textContent = `Could not fetch artwork. ${error.message}`;
    status_line.classList.add("status-error");
  } finally {
    refresh_button.disabled = false;
    result_image.classList.remove("is-loading");
    load_bar.classList.remove("is-active");
  }
}

function preload_image(url) {
  return new Promise((resolve, reject) => {
    const preloaded_image = new Image();
    preloaded_image.onload = resolve;
    preloaded_image.onerror = () => reject(new Error("Image preload failed"));
    preloaded_image.src = url;
  });
}

mode_select.addEventListener("change", () => {
  update_tag_options();
  fetch_image();
});

tag_select.addEventListener("change", fetch_image);
refresh_button.addEventListener("click", fetch_image);

update_tag_options();
fetch_image();
