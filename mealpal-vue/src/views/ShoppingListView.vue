<template>
  <div class="shopping-list-container">
    <h1 class="text-2xl font-bold mb-4">Let's Go Grocery Shopping</h1>

    <div class="actions">
      <button class="get-list-button" @click="generateShoppingList">Get Shopping List</button>
      <button class="reset-button" @click="resetShoppingList">Reset</button>
    </div>

    <div v-if="shoppingList.length" class="shopping-list">
      <h2 class="text-xl font-semibold mt-6">Your Shopping List:</h2>
      <ul class="list-disc pl-5 mt-4">
        <li v-for="(item, index) in shoppingList" :key="index">
          {{ item.quantity }} {{ item.unit }} {{ item.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "ShoppingListView",
  data() {
    return {
      shoppingList: [], // Array to store the generated shopping list
    };
  },
  methods: {
    async generateShoppingList() {
      try {
        // Fetch meal planner data
        const mealPlannerResponse = await fetch("/week_plan.json");
        if (!mealPlannerResponse.ok) {
          throw new Error("Failed to fetch week_plan.json");
        }
        const mealPlanner = await mealPlannerResponse.json();

        // Fetch recipes data
        const recipesResponse = await fetch("/recipes.json");
        if (!recipesResponse.ok) {
          throw new Error("Failed to fetch recipes.json");
        }
        const recipes = await recipesResponse.json();

        // Collect ingredients for all selected meals
        const ingredientsMap = {};
        mealPlanner.forEach((day) => {
          day.meals.forEach((meal) => {
            const recipe = recipes.find((r) => r.name === meal.recipe);
            if (recipe) {
              recipe.ingredients.forEach((ingredient) => {
                const key = `${ingredient.name}-${ingredient.unit}`;
                if (!ingredientsMap[key]) {
                  ingredientsMap[key] = {
                    name: ingredient.name,
                    unit: ingredient.unit,
                    quantity: 0,
                  };
                }
                ingredientsMap[key].quantity += ingredient.quantity;
              });
            }
          });
        });

        // Convert the ingredients map to an array
        this.shoppingList = Object.values(ingredientsMap);
      } catch (error) {
        console.error("Error generating shopping list:", error.message);
        alert("Failed to generate shopping list. Please check your data files.");
      }
    },
    resetShoppingList() {
      this.shoppingList = []; // Clear the shopping list
    },
  },
};
</script>

<style scoped>
.shopping-list-container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  padding: 20px;
  background-color: #fffaf0; /* Beige background */
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.get-list-button {
  background-color: #28a745; /* Green */
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.get-list-button:hover {
  background-color: #218838;
}

.reset-button {
  background-color: #dc3545; /* Red */
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.reset-button:hover {
  background-color: #c82333;
}

.shopping-list {
  text-align: left;
  margin-top: 20px;
}

.shopping-list h2 {
  margin-bottom: 10px;
}

.list-disc {
  list-style-type: disc;
}
</style>
