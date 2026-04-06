const tag_sets = {
  sfw: [
    "waifu", "neko", "shinobu", "megumin", "bully", "cuddle", "cry", "hug",
    "awoo", "kiss", "lick", "pat", "smug", "bonk", "yeet", "blush", "smile",
    "wave", "highfive", "handhold", "nom", "bite", "glomp", "slap", "kill",
    "kick", "happy", "wink", "poke", "dance", "cringe"
  ],
  nsfw: ["waifu", "neko", "trap", "blowjob"]
};

const random_image = document.getElementById("random_image");
const tag_select = document.getElementById("tag_select");
const generate_button = document.getElementById("generate_button");
const shuffle_button = document.getElementById("shuffle_button");
const status_line = document.getElementById("status_line");
const mode_badge = document.getElementById("mode_badge");
const tag_badge = document.getElementById("tag_badge");
const load_bar = document.getElementById("load_bar");

function selected_mode() {
  return document.querySelector('input[name="content_mode"]:checked').value;
}

function update_dropdown() {
  const mode = selected_mode();
  tag_select.innerHTML = "";

  for (const tag_name of tag_sets[mode]) {
    const option = document.createElement("option");
    option.value = tag_name;
    option.textContent = tag_name;
    tag_select.appendChild(option);
  }

  sync_badges();
}

function sync_badges() {
  mode_badge.textContent = selected_mode().toUpperCase();
  tag_badge.textContent = tag_select.value || "none";
}

function shuffle_tag() {
  const mode = selected_mode();
  const tags = tag_sets[mode];
  const next_index = Math.floor(Math.random() * tags.length);
  tag_select.value = tags[next_index];
  sync_badges();
  generate_image();
}

async function generate_image() {
  const mode = selected_mode();
  const tag_name = tag_select.value;

  sync_badges();
  status_line.textContent = "Fetching a new image...";
  status_line.classList.remove("status-error");
  generate_button.disabled = true;
  shuffle_button.disabled = true;
  random_image.classList.add("is-loading");
  load_bar.classList.add("is-active");

  try {
    const response = await fetch(`https://api.waifu.pics/${mode}/${tag_name}`);
    if (!response.ok) {
      throw new Error(`Request failed with ${response.status}`);
    }

    const payload = await response.json();
    if (!payload.url) {
      throw new Error("Image URL missing in response");
    }

    await preload_image(payload.url);
    random_image.src = payload.url;
    random_image.alt = `${mode.toUpperCase()} ${tag_name} artwork`;
    status_line.textContent = `Showing ${tag_name} from ${mode.toUpperCase()}.`;
  } catch (error) {
    status_line.textContent = `Unable to load image. ${error.message}`;
    status_line.classList.add("status-error");
  } finally {
    generate_button.disabled = false;
    shuffle_button.disabled = false;
    random_image.classList.remove("is-loading");
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

document.querySelectorAll('input[name="content_mode"]').forEach((mode_input) => {
  mode_input.addEventListener("change", () => {
    update_dropdown();
    generate_image();
  });
});

tag_select.addEventListener("change", sync_badges);
generate_button.addEventListener("click", generate_image);
shuffle_button.addEventListener("click", shuffle_tag);

update_dropdown();
generate_image();
