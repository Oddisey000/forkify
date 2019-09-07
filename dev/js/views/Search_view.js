import { elements } from './base';

// Function to get results
export const getInput = () => elements.searchInput.value;

//Cleare the input field
export const clearInput = () => {
    elements.searchInput.value = '';
};

//Clear previous results
export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
};

// Function for getting results array
export const getResults = recipes => {
    recipes.forEach(renderResults);
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
const limitRecipeTitle = (title, limit = 17) => {
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