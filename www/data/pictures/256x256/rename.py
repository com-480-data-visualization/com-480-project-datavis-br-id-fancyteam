import os

filename = "images"

for i in range(1, 820):
    os.rename('%d'%i + '.png', '%03d'%i + '.png')

    
