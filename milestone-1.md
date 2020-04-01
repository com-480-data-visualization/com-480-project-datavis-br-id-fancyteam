# Milestone 1 (Friday 3rd April, 5pm)
**10% of the final grade**

## Dataset (1'268 characters)

In our dataset explorations, we came across a dataset containing [Pokémon from Generations 1 to 6](https://www.kaggle.com/abcsds/pokemon). This dataset dates from 2016, so it does not contain Pokémon from more recent generations, namely 7 and 8. However, it seems to be relatively complete, and claims to use data from well-known sources such as [pokemon.com](https://www.pokemon.com/us/pokedex/), [pokemondb](https://pokemondb.net/pokedex) and [bulbapedia](https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_National_Pok%C3%A9dex_number).

On its overview page, you can see that 800 unique values for names are provided, while the generations listed are supposed to contain [a total of 721 Pokémon](https://en.wikipedia.org/wiki/List_of_Pok%C3%A9mon#Detailed_lists_by_generation). If we compare with the unique identifiers, we indeed find 721. We will have to check whetever there is an issue with the names, or not.

The dataset offers many statistics to explore, including the types of Pokémon, some of their stats - although a lot of [extended statistics](https://bulbapedia.bulbagarden.net/wiki/Statistic) exist - the number of their generation and their legendary status. The dataset itself states that perhaps more work should be done on the [Legendary status](https://bulbapedia.bulbagarden.net/wiki/Legendary_Pok%C3%A9mon), to be compared to the [Mythical status](https://bulbapedia.bulbagarden.net/wiki/Mythical_Pok%C3%A9mon).

We will be able to compare this dataset not only with the cited sources, but also with other sources, such as [other, extended datasets](https://www.kaggle.com/rounakbanik/pokemon). We will also be able to use image datasets, such as [that one (120x120px)](https://www.kaggle.com/vishalsubbiah/pokemon-images-and-types) or [that one (256x256px)](https://www.kaggle.com/kvpratama/pokemon-images-dataset), to complete our visualizations- and, why not, [use some 3D](https://all3dp.com/pokemon-3d-model/)!.

## Problematic (623 characters)

We are most interested in the links between the different Types, and how they influence each other. Influence of the types vs. the statistics, and analysis to answer the big "best starter" question (i.e. "Which is the best Pokémon to choose to start the game") will be a lot of fun as well.

Our approach will attempt to interactively showcase Pokémon statistics, on the assumption that it will not be viewed by leading data scientists, but rather by ordinary people who want to discover the mathematical world of Pokémon. It is important to us to make this data accessible and understandable to as many people as possible.

## Exploratory Data Analysis (1'898 characters)

We notice 13 columns. The first column is the Pokémon's `ID`, the second their `Name`. We then have the `Type`s (Pokémon can have one or two types), and then some statistics. For the statistics, the column `Total` is the sum of all numbered statistics, namely all of the numbers beside the generation number and the legendary status. Next are all the basic statistics for one Pokémon, like `Attack`, `Special Defense` or `Speed`. Finally, we have the Pokémon's `Generation` number (i.e. their "season") and a `Legendary` status.

For the name, as stated before, there's a catch. We have 721 unique Pokémon `ID` and yet have 800 `Name`s. Turns out, some Pokémon have multiple form. For instance, [`Charizard` has four forms](https://bulbapedia.bulbagarden.net/wiki/Charizard_(Pok%C3%A9mon)). We will have to take that into account when showing these Pokémon!

There are 18 of Pokémon. Each Pokémon has at least one type, while only 414 Pokémon have a secondary Type- about half of them.

Now let's dive in the statistics. Extensive work can be done on these statistics, however, it can already be noted that the values are very varied. For example, the sum of the values of the statistics ranges from 180 to 780, with an average of 435 and a standard derivation of 120. We can already imagine that some Pokémons have a great advantage over others!

For the `Generation`, the numbers are by default wrong, because we have to take into account the multiple Pokémon evolutions, as stated before. The database does not state when a new form for a Pokémon was added. This shall be fixed by us if time permits. However, after removing the non-unique values, the numbers match with [our ground truth](https://en.wikipedia.org/wiki/List_of_Pok%C3%A9mon#Detailed_lists_by_generation).

Finally, we have 65 Legendary Pokémon for 735 Common Pokémon. We have to take into account the fact that in this database Legendary is used to denote both [Legendary](https://bulbapedia.bulbagarden.net/wiki/Legendary_Pok%C3%A9mon) and [Mythical](https://bulbapedia.bulbagarden.net/wiki/Mythical_Pok%C3%A9mon) Pokémon. Additionnal work may be done to separate them.

You can find the complete analysis in the [dedicated notebook](./notebooks/).

## Related work (1'219 characters)

Taking into account the [uses on Kaggle](https://www.kaggle.com/abcsds/pokemon/kernels), this dataset was mainly used for [learning data analysis methods](https://www.kaggle.com/ash316/learn-pandas-with-pokemons). Some extensive studies have tried to show or have shown the links between types and statistics, the different "secrets" that can be found, etc.

One issue has already been explicitly addressed with this dataset: "The type of a pokémon cannot be inferred only by it's Attack and Deffence". The set also proposes that "It would be worthy to find which two variables can define the type of a pokemon, if any".

As previously stated, our approach will attempt to interactively showcase Pokémon statistics, on the assumption that it will not be viewed by leading data scientists, but rather by ordinary people who want to discover the mathematical world of Pokémon. It is important to us to make this data accessible and understandable to as many people as possible.

We have been lucky to find many sources of inspiration. We were particularly interested in an example of [how the types were linked](https://public.tableau.com/profile/yung.ching.chen#!/vizhome/PokemonDataVisualization/Story1). We were moved as well to see than the data science field was not only for us scholar people, but [for younglings too](https://www.tableau.com/about/blog/2016/8/how-data-kid-found-his-favorite-pokemon-data-57650).

We did not use the data prior to this course and thus are excited to start a new, intriguing project!