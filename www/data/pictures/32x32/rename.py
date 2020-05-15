import os

filename = "images"

for i in range(1, 820):
    os.rename('%03d'%i + '.jpg', '%03d'%i + '.png')

    
