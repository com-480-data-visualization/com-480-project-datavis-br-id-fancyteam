import os
import csv

filename = "../../pokemon001-721.csv"
    

with open(filename, newline='') as csvfile:
    pokemons = csv.reader(csvfile, delimiter=',')
    for p in pokemons:
        os.rename(p[1].lower() + '.png', '%03d'%p[0] + '.png')
        os.rename(p[1].lower() + '.jpg', '%03d'%p[0] + '.png')
        
