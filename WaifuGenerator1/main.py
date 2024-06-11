import requests
import os
from datetime import datetime

# Specify the genres for the waifu image
sfw_genres = [
    'waifu', 'neko', 'shinobu', 'megumin', 'bully', 'cuddle', 'cry', 'hug',
    'awoo', 'kiss', 'lick', 'pat', 'smug', 'bonk', 'yeet', 'blush', 'smile',
    'wave', 'highfive', 'handhold', 'nom', 'bite', 'glomp', 'slap', 'kill',
    'kick', 'happy', 'wink', 'poke', 'dance', 'cringe'
]
nsfw_genres = [
    'waifu', 'neko', 'trap', 'blowjob'
]

def generate_waifu_image(genre, nsfw):
    try:
        endpoint = f'https://api.waifu.pics/{nsfw}/{genre}'

        response = requests.get(endpoint)
        response.raise_for_status()

        data = response.json()
        if 'url' not in data:
            print(f"No image URL found for {genre}.")
            return

        waifu_url = data['url']
        print(f"Generated {genre} image URL: {waifu_url}")

        # Download the waifu image
        response = requests.get(waifu_url)
        response.raise_for_status()

        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        if not os.path.exists("images"): # IMPORTANT ADD A 'images' FOLDER TO MAKE IT WORK
            os.makedirs("images")
        with open(f'images/{nsfw}_{genre}_{timestamp}.jpg', 'wb') as f:
            f.write(response.content)
        print(f"{genre} image downloaded successfully!")
    except requests.exceptions.RequestException as e:
        print(f"An error occurred during the request for {genre}: {str(e)}")
    except (KeyError, ValueError) as e:
        print(f"An error occurred while parsing the API response for {genre}: {str(e)}")
    except StopIteration:
        print(f"The selected genre '{genre}' is not available. Exiting...")
        exit(1)
    except Exception as e:
        print(f"An error occurred for {genre}: {str(e)}")

# Prompt the user to choose SFW or NSFW
nsfw_input = input("Generate SFW (Safe for Work) or NSFW (Not Safe for Work) image? PICK: [sfw (s) / nsfw (n)]: ")
if nsfw_input.lower() in ["sfw", "s"]:
    nsfw = "sfw"
    genres = sfw_genres
elif nsfw_input.lower() in ["nsfw", "n"]:
    nsfw = "nsfw"
    genres = nsfw_genres
else:
    print("Invalid input. Exiting...")
    exit(1)

# Generate waifu images
while True:
    # Prompt the user to choose a genre
    print("Available genres:")
    for index, genre in enumerate(genres):
        print(f"{index + 1}. {genre}")

    selected_genre = input("Enter the number or name corresponding to the desired genre: ")

    # Validate user input
    if selected_genre.isdigit():
        selected_genre_index = int(selected_genre) - 1
        if selected_genre_index < 0 or selected_genre_index >= len(genres):
            print("Invalid genre selection. Exiting...")
            exit(1)
        genre = genres[selected_genre_index]
    else:
        if selected_genre.lower() not in [g.lower() for g in genres]:
            print("Invalid genre selection. Exiting...")
            exit(1)
        selected_genre_lower = selected_genre.lower()
        genre = next(g for g in genres if g.lower() == selected_genre_lower)

    generate_waifu_image(genre, nsfw)

    choice = input("Do you want to generate more images? PICK: [yes (y) / no (n)]: ")
    if choice.lower() not in ["yes", "y"]:
        break

    nsfw_input = input("Generate SFW (Safe for Work) or NSFW (Not Safe for Work) image? PICK: [sfw (s) / nsfw (n)]: ")
    if nsfw_input.lower() in ["sfw", "s"]:
        nsfw = "sfw"
        genres = sfw_genres
    elif nsfw_input.lower() in ["nsfw", "n"]:
        nsfw = "nsfw"
        genres = nsfw_genres
    else:
        print("Invalid input. Exiting...")
        exit(1)
