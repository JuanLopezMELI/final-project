const BASE_URL = 'https://rickandmortyapi.com/api';
const CHARACTERS_URL = `${BASE_URL}/character`;

const mainCardsContainer = document.getElementById('cards-container');
const previousButton = document.getElementById('previous-button');
const nextButton = document.getElementById('next-button');

let characters = [];

async function getCharacters() {
    try {
        const response = await fetch(CHARACTERS_URL);
        const data = await response.json();
        characters = data.results;
        return characters;
    } catch (error) {
        console.error(error);
    }
}

getCharacters()
    .then((characters) => {
        buildBodyMainStructure(characters);
        listenChanges(characters);
        addPagingButtonsFunctionality()
        addViewInfoFunctionality(characters);
    })
    .catch((error) => {
        console.log(error);
    });

function getPaginatedCharacters(pageNumber) {
    const url = `${CHARACTERS_URL}/?page=${pageNumber}`;
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            mainCardsContainer.innerHTML = '';
            characters = data.results;
            buildBodyMainStructure(data.results);
            listenChanges(characters);
            addViewInfoFunctionality(characters);
        })
        .catch((error) => {
            console.log(error);
        });
}

function buildBodyMainStructure(characters) {
    characters.forEach((character) => {
        const card = buildCard(
            character.image,
            character.name,
            `${character.species} - ${character.gender}, ${character.status}.`,
            "View Info",
            '#'
        );
        mainCardsContainer.appendChild(card);
    });
}

function listenChanges(characters) {
    const nameInput = document.getElementById('name-filter');
    const statusInput = document.getElementById('status-filter');
    const speciesInput = document.getElementById('species-filter');
    const genderInput = document.getElementById('gender-filter');

    const filterCharactersByInput = () => {
        const name = nameInput.value;
        const status = statusInput.value;
        const species = speciesInput.value;
        const gender = genderInput.value;
        const filteredCharacters = filterCharacters(characters, name, status, species, gender);
        mainCardsContainer.innerHTML = '';
        buildBodyMainStructure(filteredCharacters);
        addViewInfoFunctionality(filteredCharacters);
    }

    nameInput.addEventListener('input', filterCharactersByInput);
    statusInput.addEventListener('input', filterCharactersByInput);
    speciesInput.addEventListener('input', filterCharactersByInput);
    genderInput.addEventListener('input', filterCharactersByInput);
}

function addPagingButtonsFunctionality() {
    let pageNumber = 1
    previousButton.addEventListener('click', () => {
        pageNumber--;
        pageNumber = checkPageNumber('backward', pageNumber);
        getPaginatedCharacters(pageNumber);
    });

    nextButton.addEventListener('click', () => {
        pageNumber++;
        pageNumber = checkPageNumber('forward', pageNumber);
        getPaginatedCharacters(pageNumber);
    });
}

function addViewInfoFunctionality(characters) {
    const cards = Array.from(document.querySelectorAll('.card'));
    console.log(cards);
    for (let i = 0; i < cards.length; i++) {
        let actualCharacter = characters[i];
        cards[i].children[1].children[2].addEventListener('click', () => {
            Swal.fire({
                title: actualCharacter.name,
                html: buildCharacterSwalHtml(actualCharacter),
                imageUrl: actualCharacter.image,
                imageAlt: `${actualCharacter.name} image`,
            })
        });
    }
}

function buildCharacterSwalHtml(character) {
    const html = `<ul>
        <li>${character.species} - ${character.gender}, ${character.status}.</li>
        <li>Origin: ${character.origin.name}.</li>
        <li>Location: ${character.location.name}.</li></ul>`
    return html;
}

function checkPageNumber(direction, pageNumber) {
    switch (direction) {
        case 'forward':
            return checkValidForwardPage(pageNumber)
        case 'backward':
            return checkValidBackwardPage(pageNumber)
        default:
            return 1;
    }
}

function checkValidForwardPage(pageNumber) {
    if (pageNumber > 20) {
        return 1;
    }
    return pageNumber;
}

function checkValidBackwardPage(pageNumber) {
    if (pageNumber < 1) {
        return 20;
    }
    return pageNumber;
}


function filterCharacters(characters, name, status, species, gender) {
    const filtered = characters.filter((character) => {
        return character.name !== undefined
            && character.status !== undefined
            && character.species !== undefined
            && character.gender !== undefined;
    });

    console.log(filtered);
    return filtered.filter((character) => {
        return character.name.toLowerCase().includes(name.toLowerCase())
            && character.status.toLowerCase().includes(status.toLowerCase())
            && character.species.toLowerCase().includes(species.toLowerCase())
            && character.gender.toLowerCase().includes(gender.toLowerCase());
    });
}

function buildCard(imageLink, cardTitle, cardBody, cardLinkText, cardLink) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.style.width = '16rem';
    card.style.paddingInline = '0';
    card.appendChild(buildImage(imageLink));
    card.appendChild(
        buildCardBody(cardTitle, cardBody, cardLinkText, cardLink)
    );
    return card;
}

function buildImage(imageSrc) {
    const img = document.createElement('img');
    img.classList.add('card-img-top');
    img.setAttribute('src', imageSrc);
    return img;
}

function buildCardBody(title, bodyContent, linkText, href) {
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    cardBody.style.width = '100%';
    cardBody.appendChild(buildCardTitle(title));
    cardBody.appendChild(buildCardText(bodyContent));
    cardBody.appendChild(buildCardLink(linkText, href));
    return cardBody;
}

function buildCardTitle(textContent) {
    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = textContent;
    return cardTitle;
}

function buildCardText(textContent) {
    const cardText = document.createElement('p');
    cardText.classList.add('card-text');
    cardText.textContent = textContent;
    return cardText;
}

function buildCardLink(linkText, href) {
    const cardLink = document.createElement('a');
    cardLink.classList.add('btn', 'btn-primary');
    cardLink.textContent = linkText;
    cardLink.setAttribute('href', href);
    return cardLink;
}