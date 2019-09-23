import { elements } from './base';

// Function to get results, without parentacies it automatically return the value
export const getInput = () => elements.searchInput.value;

//Cleare the input field
export const clearInput = () => {
    elements.searchInput.value = '';
};

//Clear previous results
export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

//Change color of the recipe when selected
export const highlightSelected = id => {
    // Deselect previously selected item make array of all elements
    const previouslySelected = Array.from(document.querySelectorAll('.results__link'));

    // Deselect active link from all elements from the array
    previouslySelected.forEach(element => {
        element.classList.remove('results__link--active');
    });
    
    // Select all href (actualy one) which has selected id
    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
};

// Function for getting results array and devide it to 10 results per one page
export const getResults = (recipes, page = 1, resultPerPage = 10) => {
    // Render results of current page
    const start = (page - 1) * resultPerPage;
    const end = page * resultPerPage;
    recipes.slice(start, end).forEach(renderResults);

    // Render pagination buttons
    renderButtons(page, recipes.length, resultPerPage);
};

// Create buttons before use it in renderButtons function, type can be previous or the next button
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Сторінка ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="assets/icons/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>`;

// Buttons for switching beetwen result pages
const renderButtons = (page, numResults, resPerPage) => {
    // Makes all pages to be rounded to the next integer number (4.2 = 5)
    const pages = Math.ceil(numResults / resPerPage);

    //Create variable wich will containg data, and its need to be changable
    let button;

    // Devide results to the pages
    if (page === 1 & pages > 1) {
        // Only button to go to the nex page
        button = createButton(page, 'next');
    } else if (page === pages && pages > 1) {
        // Only button to go to the previous page
        button = createButton(page, 'prev');
    } else if (page < pages) {
        // Buttons between previous and the next pages
        button = `
            ${createButton(page, 'next')}
            ${createButton(page, 'prev')};`;
    }

    // Display the results of the pages
    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

// Rendering the recipes
export const renderResults = recipe => {
    const element = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results_data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    
    elements.searchResultList.insertAdjacentHTML('beforeend', element);
};

// Limit recipe's title to show it only in one line
/*
* How it is work
* 'Pasta with tomato and spinach'
* accumulator: 0 / accumulator + current.lenght = 5 / newTitle = ['Pasta']
* accumulator: 5 / accumulator + current.lenght = 9 / newTitle = ['Pasta', 'with']
* accumulator: 9 / accumulator + current.lenght = 15 / newTitle = ['Pasta', 'with', 'tomato']
* accumulator: 15 / accumulator + current.lenght = 18 / newTitle = ['Pasta', 'with', 'tomato', 'and']
*/
export const limitRecipeTitle = (title, limit = 17) => {
    // Define new empty array
    const newTitle = [];

    if (title.length > limit) {
        // Create array, count the words and see if this is meet limit requirements
        title.split(' ').reduce((accumulator, current) => {
            
            // If words what we have + new word is below limit, then push it into array
            if (accumulator + current.length <= limit) {
                newTitle.push(current);
            }
            return accumulator + current.length;
        }, 0);

        // Return the results
        return `${newTitle.join(' ')} ...`;
    }

    return title;
};