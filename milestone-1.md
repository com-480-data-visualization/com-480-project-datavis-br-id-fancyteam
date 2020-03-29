# Milestone 1 (Friday 3rd April, 5pm)
**10% of the final grade**

## Dataset

In our dataset explorations, we came across a dataset containing [Pokémon from Generations 1 to 6](https://www.kaggle.com/abcsds/pokemon). This dataset dates from 2016, so it does not contain Pokémon from more recent generations, namely 7 and 8. However, it seems to be relatively complete, and claims to use data from well-known sources such as [pokemon.com](https://www.pokemon.com/us/pokedex/), [pokemondb](https://pokemondb.net/pokedex) and [bulbapedia](https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_National_Pok%C3%A9dex_number).

On its overview page, you can see that 800 unique values for names are provided, while the generations listed are supposed to contain [a total of 721 Pokémon](https://en.wikipedia.org/wiki/List_of_Pok%C3%A9mon#Detailed_lists_by_generation). If we compare with the unique identifiers, we indeed find 721. We will have to check whetever there is an issue with the names, or not.

The dataset offers many statistics to explore, including the types of Pokémon, some of their stats - although a lot of [extended statistics](https://bulbapedia.bulbagarden.net/wiki/Statistic) exist - the number of their generation and their legendary status. The dataset itself states that perhaps more work should be done on the [Legendary status](https://bulbapedia.bulbagarden.net/wiki/Legendary_Pok%C3%A9mon), to be compared to the [Mythical status](https://bulbapedia.bulbagarden.net/wiki/Mythical_Pok%C3%A9mon).

We will be able to compare this dataset not only with the cited sources, but also with other sources, such as [other, extended datasets](https://www.kaggle.com/rounakbanik/pokemon). We will also be able to use image datasets, such as [that one (120x120px)](https://www.kaggle.com/vishalsubbiah/pokemon-images-and-types) or [that one (256x256px)](https://www.kaggle.com/kvpratama/pokemon-images-dataset), to complete our visualizations- and, why not, [use some 3D](https://all3dp.com/pokemon-3d-model/)!.

## Problematic

Frame the general topic of your visualization and the main axis that you want to develop.

- What am I trying to show with my visualization?
- Think of an overview for the project, your motivation, and the target audience.

## Exploratory Data Analysis

We are going to load the data in a `pandas` dataframe and do a quick analysis of the file. As a reminder, the data was extracted from https://www.kaggle.com/abcsds/pokemon (last update: 2020.03.26).

We notice 13 columns. The first column is the Pokemon's `ID`, the second their `Name`. We then have the `Type`s (Pokemon can have one or two types), and then some statistics. For the statistics, the column `Total` is the sum of all numbered statistics, namely all of the numbers beside the generation number and the legendary status. Next are all the basic statistics for one Pokemon, like `Attack`, `Special Defense` or `Speed`. Finally, we have the Pokemon's `Generation` number (i.e. their "season") and a `Legendary` status.

For the name, as stated before, there's a catch. We have 721 unique Pokemon `ID` and yet have 800 `Name`s. Turns out, some Pokemon have multiple form. For instance, [`Charizard` has four forms](https://bulbapedia.bulbagarden.net/wiki/Charizard_(Pok%C3%A9mon)). We will have to take that into account when showing these Pokemon!

About the types, **TODO**.

Now let's dive in the statistics. **TODO**.

For the `Generation`, the numbers are by default wrong, because we have to take into account the multiple Pokemon evolutions, as stated before. The database does not state when a new form for a Pokemon was added. This shall be fixed by us if time permits. However, after removing the non-unique values, the numbers match with [our ground truth](https://en.wikipedia.org/wiki/List_of_Pok%C3%A9mon#Detailed_lists_by_generation).

Finally, we have 65 Legendary Pokemon for 735 Common Pokemon. We have to take into account the fact that in this database Legendary is used to denote both [Legendary](https://bulbapedia.bulbagarden.net/wiki/Legendary_Pok%C3%A9mon) and [Mythical](https://bulbapedia.bulbagarden.net/wiki/Mythical_Pok%C3%A9mon) Pokemon. Additionnal work may be done to separate them.

You can find the complete analysis in the [dedicated notebook](./notebooks/Data analysis and statistics.ipynb).

## Related work

- Une question a été traitée avec ce dataset : The type of a pokemon cannot be inferred only by it's Attack and Deffence. Le set propose It would be worthy to find which two variables can define the type of a pokemon, if any. 

- What others have already done with the data?
- Why is your approach original?
- What source of inspiration do you take? Visualizations that you found on other websites or magazines (might be unrelated to your data).
- In case you are using a dataset that you have already explored in another context (ML or ADA course, semester project...), you are required to share the report of that work to outline the differences with the submission for this class.