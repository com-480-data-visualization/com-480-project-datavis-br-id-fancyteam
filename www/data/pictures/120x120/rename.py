import os
import csv

filename = "../../pokemon001-721.csv"
    

with open(filename, newline='') as csvfile:
    pokemons = csv.reader(csvfile, delimiter=',')
    next(pokemons)
    for p in pokemons:
        try:
            os.rename(p[1].lower() + '.png', '%03d'%int(p[0]) + '.png')
        except:
            ok=1
        try:
            os.rename(p[1].lower() + '.jpg', '%03d'%int(p[0]) + '.png')
        except:
            ok=1
        
