import axios from 'axios';
import { key, proxy } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const result = await axios(`${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`);
            
            // Get only required data from receiving result object
            this.title = result.data.recipe.title;
            this.author = result.data.recipe.publisher;
            this.img = result.data.recipe.image_url;
            this.url = result.data.recipe.source_url;
            this.ingredients = result.data.recipe.ingredients;

        } catch (error) {
            console.log(error);
        }
    }

    calcTime() {
        // Supose we need a 15 minutes for each ingredient for cooking
        const numberOfIngredients = this.ingredients.length;
        const periods = Math.ceil(numberOfIngredients / 3);

        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    // Parse information of all required ingredients
    parseIngredients() {
        // Test arrays
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces',  'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitShort, 'kg', 'g'];

        // Create new array with ingredients information
        const newIngredientsArray = this.ingredients.map(element => {
            // Uniform units like potato and potatos...
            let ingredient = element.toLowerCase();

            // Loop througth the testing array
            unitsLong.forEach((el, i) => {
                ingredient = ingredient.replace(el, units[i]);
            });

            // Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // Parse ingredients into count, unit and ingredient
            const arrayOfIngredients = ingredient.split(' ');
            const unitIndex = arrayOfIngredients.findIndex(unit => unitShort.includes(unit));

            // Final oject to return
            let objectIngredient;

            if (unitIndex > -1) {
                // There is a unit
                // Example 4 1/2 cups, arrayCount is [4, 1/2]
                const arrayCount = arrayOfIngredients.slice(0, unitIndex);
                let count;

                if (arrayCount.length === 1) {
                    count = eval(arrayOfIngredients[0].replace('-', '+'));
                } else {
                    // eval ("4 + 1/2") --> 4.5
                    count = eval(arrayOfIngredients.slice(0, unitIndex).join('+'));
                }

                objectIngredient = {
                    // Automaticaly receive count's variable value in ES6
                    count,
                    unit: arrayOfIngredients[unitIndex],
                    ingredient: arrayOfIngredients.slice(unitIndex + 1).join(' ')
                };

            } else if (unitIndex === -1) {
                // There is No unit inside array and no number in the first position
                objectIngredient = {
                    count: 1,
                    unit: '',
                    ingredient
                };
            } else if (parseInt(arrayOfIngredients[0], 10)) {
                // There is no unit, but first element is a number
                objectIngredient = {
                    count: parseInt(arrayOfIngredients[0], 10),
                    unit: '',
                    // Full array besides first element
                    ingredient: arrayOfIngredients.slice(1).join(' ')
                };
            }

            return objectIngredient;

        });

        // Write receiving information into the new array
        this.ingredients = newIngredientsArray;
    }

    updateServings(type) {
        // Update servings
        let newServings;

        // Update servings depending on type
        if (type === 'dec') {
            newServings = this.servings - 1;
        } else {
            newServings = this.servings + 1;
        }

        // Update ingredients
        this.ingredients.forEach(ingredient => {
            ingredient.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }
}