import os
import csv

filename = "../../pokemon001-801_extended.csv"
    

with open(filename, newline='') as csvfile:
    pokemons = csv.reader(csvfile, delimiter=',')
    next(pokemons)
    for p in pokemons:
        try:
            os.rename(p[30].lower() + '.png', '%03d'%int(p[32]) + '.png')
        except:
            ok=1
        try:
            os.rename(p[30].lower() + '.jpg', '%03d'%int(p[32]) + '.png')
        except:
            ok=1
        
