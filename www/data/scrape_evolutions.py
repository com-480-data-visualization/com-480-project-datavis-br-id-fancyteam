from bs4 import BeautifulSoup
import requests
import csv

page = requests.get("https://pokemondb.net/evolution").text
soup = BeautifulSoup(page, "html.parser")

evolutions = []
for d in soup.find_all('div', {'class': "infocard-list-evo"}):
    src_evo = None
    for dc in d.findChildren(["div", "span"], recursive=False):
        if dc.name == "div":
            to_evo = dc.findChildren("span", recursive=False)[1].small.string
            if src_evo != None:
                evolutions.append((int(src_evo[1:]), int(to_evo[1:])))
        if dc.name == "span":
            try:
                if "infocard-evo-split" in dc["class"]:
                    for split in dc.findChildren("span",
                                                 {"class": "infocard-lg-data"},
                                                 recursive=True):
                        split_to = split.small.string
                        if split_to != src_evo:
                            evolutions.append((int(src_evo[1:]),
                                               int(split_to[1:])))
                continue
            except KeyError:
                pass

        src_evo = to_evo

evolutions = (sorted(list(set(evolutions)), key=lambda x: x[0]))

with open("evolutions.csv", "w") as f:
    writ = csv.writer(f)
    writ.writerow(["source", "target"])
    for a, b in evolutions:
        writ.writerow([a, b])
