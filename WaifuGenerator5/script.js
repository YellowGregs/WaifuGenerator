const fallback_categories = [
  "neko", "waifu", "husbando", "kitsune", "baka", "bite", "blush", "bored",
  "cry", "cuddle", "dance", "facepalm", "feed", "handhold", "happy",
  "highfive", "hug", "kick", "kiss", "laugh", "nod", "nom", "nope", "pat",
  "poke", "pout", "punch", "shoot", "shrug", "slap", "sleep", "smile",
  "smug", "stare", "think", "thumbsup", "tickle", "wave", "wink", "yeet",
  "handshake", "lurk", "peck", "yawn"
];

const category_select = document.getElementById("category_select");
const generate_button = document.getElementById("generate_button");
const result_media = document.getElementById("result_media");
const status_line = document.getElementById("status_line");
const theme_toggle = document.getElementById("theme_toggle");
const category_badge = document.getElementById("category_badge");
const load_bar = document.getElementById("load_bar");
const meta_line = document.getElementById("meta_line");
const source_link = document.getElementById("source_link");

function fill_categories(categories) {
  category_select.innerHTML = "";
  for (const category_name of categories) {
    const option = document.createElement("option");
    option.value = category_name;
    option.textContent = category_name;
    category_select.appendChild(option);
  }
}

function sync_theme() {
  document.body.classList.toggle("night-theme", theme_toggle.checked);
  localStorage.setItem("night_theme_enabled", String(theme_toggle.checked));
}

async function fetch_media() {
  const category_name = category_select.value;
  const url = `https://nekos.best/api/v2/${encodeURIComponent(category_name)}`;

  generate_button.disabled = true;
  result_media.classList.add("is-loading");
  status_line.textContent = "Loading media...";
  status_line.classList.remove("status-error");
  category_badge.textContent = category_name;
  load_bar.classList.add("is-active");

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Request failed with ${response.status}`);
    }

    const payload = await response.json();
    const item = payload.results?.[0];
    if (!item?.url) {
      throw new Error("No media returned from the API");
    }

    await preload_image(item.url);
    result_media.src = item.url;
    result_media.alt = `${category_name} media from nekos.best`;
    source_link.href = item.source_url || item.artist_href || item.url;
    source_link.style.display = "inline-block";
    meta_line.textContent = build_meta_line(item);
    status_line.textContent = `Showing a random ${category_name} result.`;
  } catch (error) {
    status_line.textContent = `Could not load media. ${error.message}`;
    status_line.classList.add("status-error");
    meta_line.textContent = "Metadata unavailable.";
    source_link.href = "#";
    source_link.style.display = "none";
  } finally {
    generate_button.disabled = false;
    result_media.classList.remove("is-loading");
    load_bar.classList.remove("is-active");
  }
}

function build_meta_line(item) {
  if (item.artist_name) {
    return `Artist: ${item.artist_name}`;
  }

  if (item.anime_name) {
    return `Series: ${item.anime_name}`;
  }

  return "Random result loaded from nekos.best.";
}

async function load_categories() {
  try {
    const response = await fetch("https://nekos.best/api/v2/endpoints");
    if (!response.ok) {
      throw new Error(`Endpoint list failed with ${response.status}`);
    }

    const payload = await response.json();
    const categories = Object.keys(payload).sort((left, right) => left.localeCompare(right));
    if (!categories.length) {
      throw new Error("No categories returned");
    }

    fill_categories(categories);
    meta_line.textContent = "Category list loaded from the API.";
  } catch (error) {
    fill_categories(fallback_categories);
    meta_line.textContent = "Using fallback categories because the endpoint list could not be loaded.";
  }
}

function preload_image(url) {
  return new Promise((resolve, reject) => {
    const preloaded_image = new Image();
    preloaded_image.onload = resolve;
    preloaded_image.onerror = () => reject(new Error("Media preload failed"));
    preloaded_image.src = url;
  });
}

generate_button.addEventListener("click", fetch_media);
category_select.addEventListener("change", fetch_media);
theme_toggle.addEventListener("change", sync_theme);

const saved_theme = localStorage.getItem("night_theme_enabled") === "true";
theme_toggle.checked = saved_theme;
sync_theme();

load_categories().then(fetch_media);
