import urllib
import requests

filename = "images"

for i in range(1, 803):
    url = 'https://www.pokemontrash.com/pokedex/images/sugimori/'
    img_data = requests.get(url +'%03d'%i + '.png').content
    with open('%03d'%i +'.jpg', 'wb') as handler:
        handler.write(img_data)
    print ('Image saved for %03d.png'%i)

    
