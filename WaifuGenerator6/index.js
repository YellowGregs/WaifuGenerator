// This code in JavaScript is similar to the code written in Python by YellowGreg for WaifuGenerator1 Folder.


const fetch = require('node-fetch');
const fs = require('fs');
const { promisify } = require('util');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const sfw_genres = [
  'waifu', 'neko', 'shinobu', 'megumin', 'bully', 'cuddle', 'cry', 'hug',
  'awoo', 'kiss', 'lick', 'pat', 'smug', 'bonk', 'yeet', 'blush', 'smile',
  'wave', 'highfive', 'handhold', 'nom', 'bite', 'glomp', 'slap', 'kill',
  'kick', 'happy', 'wink', 'poke', 'dance', 'cringe'
];

const nsfw_genres = [
  'waifu', 'neko', 'trap', 'blowjob'
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generate_waifu_image(genre, nsfw) {
  try {
    const endpoint = `https://api.waifu.pics/${nsfw}/${genre}`;

    const response = await fetch(endpoint);
    const data = await response.json();

    if (!data.url) {
      console.log(`No image URL found for ${genre}.`);
      return;
    }

    const waifu_url = data.url;
    console.log(`Generated ${genre} image URL: ${waifu_url}`);

    const imageResponse = await fetch(waifu_url);
    const imageBuffer = await imageResponse.buffer();

    const timestamp = new Date().toISOString().replace(/[-:.T]/g, '');
    const folderPath = 'images';
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    const filePath = `${folderPath}/${nsfw}_${genre}_${timestamp}.jpg`;
    await promisify(fs.writeFile)(filePath, imageBuffer);

    console.log(`${genre} image downloaded successfully!`);
  } catch (error) {
    console.log(`An error occurred: ${error}`);
  }
}

async function main() {
  const nsfw_input = await new Promise(resolve => {
    rl.question("Generate SFW (Safe for Work) or NSFW (Not Safe for Work) image? PICK: [sfw (s) / nsfw (n)]: ", resolve);
  });

  let nsfw, genres;

  if (nsfw_input.toLowerCase() === "sfw" || nsfw_input.toLowerCase() === "s") {
    nsfw = "sfw";
    genres = sfw_genres;
  } else if (nsfw_input.toLowerCase() === "nsfw" || nsfw_input.toLowerCase() === "n") {
    nsfw = "nsfw";
    genres = nsfw_genres;
  } else {
    console.log("Invalid input. Exiting...");
    rl.close();
    return;
  }

  while (true) {
    console.log("Available genres:");
    genres.forEach((genre, index) => {
      console.log(`${index + 1}. ${genre}`);
    });

    const selected_genre = await new Promise(resolve => {
      rl.question("Enter the number or name corresponding to the desired genre: ", resolve);
    });

    let genre;

    if (!isNaN(selected_genre)) {
      const selected_genre_index = parseInt(selected_genre) - 1;
      if (selected_genre_index < 0 || selected_genre_index >= genres.length) {
        console.log("Invalid genre selection. Exiting...");
        rl.close();
        return;
      }
      genre = genres[selected_genre_index];
    } else {
      const selected_genre_lower = selected_genre.toLowerCase();
      const foundGenre = genres.find(g => g.toLowerCase() === selected_genre_lower);
      if (!foundGenre) {
        console.log("Invalid genre selection. Exiting...");
        rl.close();
        return;
      }
      genre = foundGenre;
    }

    await generate_waifu_image(genre, nsfw);

    const choice = await new Promise(resolve => {
      rl.question("Do you want to generate more images? PICK: [yes (y) / no (n)]: ", resolve);
    });

    if (choice.toLowerCase() !== "yes" && choice.toLowerCase() !== "y") {
      rl.close();
      break;
    }

    const nsfw_input = await new Promise(resolve => {
      rl.question("Generate SFW (Safe for Work) or NSFW (Not Safe for Work) image? PICK: [sfw (s) / nsfw (n)]: ", resolve);
    });

    if (nsfw_input.toLowerCase() === "sfw" || nsfw_input.toLowerCase() === "s") {
      nsfw = "sfw";
      genres = sfw_genres;
    } else if (nsfw_input.toLowerCase() === "nsfw" || nsfw_input.toLowerCase() === "n") {
      nsfw = "nsfw";
      genres = nsfw_genres;
    } else {
      console.log("Invalid input. Exiting...");
      rl.close();
      return;
    }
  }
}

main();
