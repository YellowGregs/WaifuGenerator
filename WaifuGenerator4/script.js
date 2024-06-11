
const apiUrl = 'https://api.waifu.im/search';
const tags = {
  sfw: ['waifu', 'maid', 'marin-kitagawa', 'mori-calliope', 'raiden-shogun', 'oppai', 'selfies', 'uniform'],
  nsfw: ["ass", "hentai", "milf", "oral", "paizuri", "ecchi", "ero"]
};

async function fetchTags() {
    try {
      const response = await fetch('https://api.waifu.im/tags');
      if (!response.ok) {
        throw new Error('Failed to fetch tags: ' + response.status);
      }
      const tagsData = await response.json();
      const apiTags = tagsData.tags;
  
      const tagDropdown = document.getElementById('tag-dropdown');
      const modeDropdown = document.getElementById('mode-dropdown');
      const selectedTags = tags[modeDropdown.value];
  
      updateTagDropdown(selectedTags);
      tagDropdown.addEventListener('change', fetchImageByTag);
      modeDropdown.addEventListener('change', function () {
        const selectedTags = tags[modeDropdown.value];
        updateTagDropdown(selectedTags);
        fetchImageByTag(); // Fetch new image based on the selected mode
      });
  
      fetchImageByTag(); // Fetch initial image on page load
    } catch (error) {
      console.error('An error occurred:', error.message);
    }
  }

async function fetchImageByTag() {
  try {
    const selectedTag = document.getElementById('tag-dropdown').value;
    const apiUrlWithParams = `${apiUrl}?included_tags=${selectedTag}`;

    // Show loading state
    showLoadingState();

    const response = await fetch(apiUrlWithParams);

    if (!response.ok) {
      throw new Error('Failed to fetch image: ' + response.status);
    }

    const imageData = await response.json();
    const image = imageData.images[0]; 

    updateImageElement(image);
    updateTagsContainer(image.tags);
  } catch (error) {
    console.error('An error occurred:', error.message);
  } finally {
    // Hide loading state
    hideLoadingState();
  }
}

function updateTagDropdown(selectedTags) {
  const tagDropdown = document.getElementById('tag-dropdown');

  clearDropdownOptions(tagDropdown);

  const fragment = document.createDocumentFragment();
  for (const tag of selectedTags) {
    const option = createOptionElement(tag);
    fragment.appendChild(option);
  }

  tagDropdown.appendChild(fragment);
}

function updateImageElement(image) {
  const resultDiv = document.getElementById('result');
  const imageElement = resultDiv.querySelector('img');
  const sourceLink = resultDiv.querySelector('a');

  imageElement.src = image.url;
  sourceLink.href = image.source;
}

function updateTagsContainer(tags) {
  const tagsContainer = document.querySelector('.tags-container');
  while (tagsContainer.firstChild) {
    tagsContainer.removeChild(tagsContainer.firstChild);
  }

  for (const tag of tags) {
    const tagElement = createTagElement(tag.name);
    tagsContainer.appendChild(tagElement);
  }
}

function clearDropdownOptions(dropdown) {
  while (dropdown.firstChild) {
    dropdown.removeChild(dropdown.firstChild);
  }
}

function createOptionElement(tag) {
  const option = document.createElement('option');
  option.value = tag;
  option.textContent = tag;
  return option;
}

function createTagElement(tagName) {
  const tagElement = document.createElement('span');
  tagElement.classList.add('tag');
  tagElement.textContent = tagName;
  return tagElement;
} 

function showLoadingState() {
  const refreshButton = document.getElementById('refresh-button');
  refreshButton.disabled = true;
  refreshButton.textContent = 'Loading...';
}

function hideLoadingState() {
  const refreshButton = document.getElementById('refresh-button');
  refreshButton.disabled = false;
  refreshButton.textContent = 'Refresh';
}

function handleRefreshButtonClick() {
  fetchImageByTag();
}

const refreshButton = document.getElementById('refresh-button');
refreshButton.addEventListener('click', handleRefreshButtonClick);

updateTagDropdown(tags.sfw);
fetchTags();
