# Rick and Morty API Client

This project is a simple web application that allows users to browse and filter characters from the Rick and Morty TV show using the [Rick and Morty API](https://rickandmortyapi.com/).

### Usage

- The client will automatically fetch 20 characters from the api. If you want to see different ones, you can use the `previous` and `next` buttons at the top of the page.
- There are four available filters. You can filter by `name`, `status`, `gender` and `species`.
- The filter works as a includes. So for example, if you type `male` as the gender, it will retrieve both male and female characters cause `female` contains the word `male`.
- The available genders are:
  - Female, Male, Genderless, Unknown
- The available statuses are:
  - Alive, Dead, Unknown
- There are also several species, such as:
  - Human, humanoid, Mythological Creature, Alien, Poopybutthole, Robot, etc.

If you click on the `view info` button of each card, it will fire a sweetalert component. This component will show another character characteristics such as:

- Origin: The born place of the character
- Location: The home place of the character
