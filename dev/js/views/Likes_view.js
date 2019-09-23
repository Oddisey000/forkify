import { elements } from './base';
import { limitRecipeTitle } from './Search_view';

export const toggleLikeBtn = isLiked => {

    // Declaring a variable to save button results
    let iconString;

    if (isLiked) {
        iconString = 'icon-heart';
    } else {
        iconString = 'icon-heart-outlined';
    }

    // Load the correct image depending on isLiked result
    document.querySelector('.recipe__love use').setAttribute('href', `assets/icons/icons.svg#${iconString}`);
};

// Displaying or not likes menue
export const toggleLikeMenu = numLikes => {

    // Change visibility of heart icon depending if user has some likes or not
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};

// Display liked recipes in likes menu
export const renderLike = like => {
    
    // Create html markup for list of liked recipes
    const markup = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="${like.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li>
    `;

    // Insert markup into the DOM
    elements.likesList.insertAdjacentHTML('beforeend', markup);
};

// Delete recipe from like list
export const deleteLike = id => {

    // Locate and select element based on its id, select all elements with likes__link class
    const element = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;

    // Remove recipe from the DOM
    if (element) element.parentElement.removeChild(element);
};