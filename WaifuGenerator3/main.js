const randomImage = document.querySelector(".random-image");
const randomWaifu = document.querySelector(".random-waifu");
const randomWaifuNsfw = document.querySelector(".random-waifu-nsfw");
const formSelect = document.querySelector(".form-select");
const formSelectNsfw = document.querySelector(".form-select-nsfw");
const nsfwToggle = document.querySelector("#nsfwToggle");
const imageWrapper = document.querySelector('.image-wrapper');
const sfwContainer = document.querySelector(".sfw");
const nsfwContainer = document.querySelector(".nsfw");
const checkboxNsfw = document.querySelector('input[type=checkbox]');
const loading = './load.svg';

sfwContainer.style.display = "flex";
nsfwContainer.style.display = "none";

formSelect.addEventListener('change', generateWaifu);
formSelectNsfw.addEventListener('change', generateWaifu);
nsfwToggle.addEventListener('change', toggleNsfwMode);
randomWaifu.addEventListener("click", generateWaifu);
randomWaifuNsfw.addEventListener("click", generateWaifu);

function toggleNsfwMode() {
  if (checkboxNsfw.checked) {
    nsfwContainer.style.display = "flex";
    sfwContainer.style.display = "none";
  } else {
    sfwContainer.style.display = "flex";
    nsfwContainer.style.display = "none";
  }
  generateWaifu();
}

function generateWaifu() {
  randomImage.src = loading;

  if (sfwContainer.style.display === "flex") {
    fetchWaifu('sfw', formSelect.value);
  } else if (nsfwContainer.style.display === "flex") {
    fetchWaifu('nsfw', formSelectNsfw.value);
  }
}

async function fetchWaifu(type, category) {
  const apiUrl = `https://api.waifu.pics/${type}/${category}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    randomImage.src = data.url;
  } catch (error) {
    console.error("Error fetching waifu:", error);
  }
}

generateWaifu();
