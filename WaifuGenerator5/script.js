// Really lazy code here because im sleepy lol

document.addEventListener('DOMContentLoaded', () => {
  const categoryDropdown = document.getElementById('categoryDropdown');
  const getRandomImageBtn = document.getElementById('getRandomImageBtn');
  const nekoImage = document.getElementById('nekoImage');
  const darkModeCheckbox = document.getElementById('darkModeCheckbox');
  const loadingSpinner = document.createElement('div');

  // Check if dark mode is enabled in the local storage
  const darkModeEnabled = localStorage.getItem('darkModeEnabled') === 'true';
  setDarkMode(darkModeEnabled);

  getRandomImageBtn.addEventListener('click', () => {
    const selectedCategory = categoryDropdown.value;
    if (selectedCategory === 'hug' || selectedCategory === 'laugh') {
      getRandomGif(selectedCategory);
    } else {
      getRandomImage(selectedCategory);
    }
  });

  darkModeCheckbox.addEventListener('change', () => {
    setDarkMode(darkModeCheckbox.checked);
  });

  function setDarkMode(enabled) {
    if (enabled) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkModeEnabled', enabled);
  }

  async function getRandomImage(category) {
    try {
      showLoadingSpinner();
      const response = await fetch(`https://nekos.best/api/v2/${category}`);
      const data = await response.json();
      const imageUrl = data.results[0].url;
      nekoImage.src = imageUrl;
      hideLoadingSpinner();
    } catch (error) {
      console.error('Error fetching random image:', error);
      hideLoadingSpinner();
    }
  }

  async function getRandomGif(category) {
    try {
      showLoadingSpinner();
      const response = await fetch(`https://nekos.best/api/v2/${category}?amount=10`);
      const data = await response.json();
      const gifUrls = data.results.map((result) => result.url);
      const randomIndex = Math.floor(Math.random() * gifUrls.length);
      const gifUrl = gifUrls[randomIndex];
      nekoImage.src = gifUrl;
      hideLoadingSpinner();
    } catch (error) {
      console.error('Error fetching random GIF:', error);
      hideLoadingSpinner();
    }
  }

  function showLoadingSpinner() {
    loadingSpinner.innerHTML = '<div class="custom-spinner"></div>';
    loadingSpinner.classList.add('loading-spinner-container');
    nekoImage.style.opacity = '0.3'; // Reduce image opacity during loading
    nekoImage.after(loadingSpinner);
  }

  function hideLoadingSpinner() {
    loadingSpinner.classList.remove('loading-spinner-container');
    loadingSpinner.innerHTML = '';
    nekoImage.style.opacity = '1'; // Reset image opacity after loading
  }
});
