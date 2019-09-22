import {elements} from './base';
import {Fraction} from 'fractional';

// Fraction all ingredients
const formatCount = count => {
    if (count) {
        // Example 2.5 --> 2 1/2; 0.5 --> 1/2
        // Destructuring array of data, integer for hole numbers and decimal for decimal values
        const [int, dec] = count.toString().split('.').map(element => parseInt(element, 10));
        
        // If no decimals then just return count
        if (!dec) {
            return count;
        }

        // If we have decimal in the count array
        if (int === 0) {
            const fraction = new Fraction(count);
            
            // Split numerator and denumerator
            return `${fraction.numerator}/${fraction.denominator}`;
        } else {
            
            // If we have hole and decimal numbers in the array
            const fraction = new Fraction(count - int);
            return `${int} ${fraction.numerator}/${fraction.denominator}`;
        }
    }
   
    return '?';
};

// Clear div element with a recipe before load new one
export const clearRecipe = () => {
    elements.recipe.innerHTML = '';
};

// Create a function wich is gona loop throuth ingredients outside renderRecipe function
const createIngredients = ingredients => `
    <li class="recipe__item">
        <svg class="recipe__icon">
            <use href="assets/icons/icons.svg#icon-check"></use>
        </svg>
        <div class="recipe__count">${formatCount(ingredients.count)}</div>
        <div class="recipe__ingredient">
            <span class="recipe__unit">${ingredients.unit}</span>
            ${ingredients.ingredient}
        </div>
    </li>
`;

export const renderRecipe = recipe => {
    const markup = `
        <figure class="recipe__fig">
            <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
            <h1 class="recipe__title">
                <span>${recipe.title}</span>
            </h1>
        </figure>
        <div class="recipe__details">
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="assets/icons/icons.svg#icon-stopwatch"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
                <span class="recipe__info-text"> minutes</span>
            </div>
        <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="assets/icons/icons.svg#icon-man"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
            <span class="recipe__info-text"> Порції</span>
            <div class="recipe__info-buttons">
                <button class="btn-tiny btn-decrease">
                    <svg>
                        <use href="assets/icons/icons.svg#icon-circle-with-minus"></use>
                    </svg>
                </button>
                <button class="btn-tiny btn-increase">
                    <svg>
                        <use href="assets/icons/icons.svg#icon-circle-with-plus"></use>
                    </svg>
                </button>
            </div>
        </div>
            <button class="recipe__love">
                <svg class="header__likes">
                    <use href="assets/icons/icons.svg#icon-heart-outlined"></use>
                </svg>
            </button>
        </div>
        <div class="recipe__ingredients">
            <ul class="recipe__ingredient-list">
                ${recipe.ingredients.map(element => createIngredients(element)).join('')}
            </ul>
            <button class="btn-small recipe__btn recipe__btn--add">
                <svg class="search__icon">
                    <use href="assets/icons/icons.svg#icon-shopping-cart"></use>
                </svg>
                <span>Add to shopping list</span>
            </button>
        </div>

        <div class="recipe__directions">
            <h2 class="heading-2">Як приготувати</h2>
            <p class="recipe__directions-text">
                Дані рецепти були уважно підготовлені та протестовані
                <span class="recipe__by">${recipe.author}</span>. Весь список рецептів можна переглянути на даному ресурсі.
            </p>
            <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
                <span>Directions</span>
                <svg class="search__icon">
                    <use href="assets/icons/icons.svg#icon-triangle-right"></use>
                </svg>
            </a>
        </div>
    `;

    elements.recipe.insertAdjacentHTML('afterbegin', markup);
};

// Update servings and ingredients
export const updateSI = recipe => {
    
    // Update servings
    document.querySelector('.recipe__info-data--people').textContent = recipe.servings;

    // Update ingredients, makes array and update all elements one by one
    const updateIngredients = Array.from(document.querySelectorAll('.recipe__count'));
    updateIngredients.forEach((element, index) => {
        element.textContent = formatCount(recipe.ingredients[index].count);
    });
};