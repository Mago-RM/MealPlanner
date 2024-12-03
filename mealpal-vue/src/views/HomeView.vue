<template>
 <BaseLayout>
    <div class="home">

      <!-- Meal Schedule Placeholder -->
      <div class="meal-schedule-placeholder">
        <h2 class="section-title">Meal Schedule for the Week</h2>
        <p class="placeholder-text">Your weekly meal plan will appear here.</p>
        <!-- Add functionality to load the meal schedule in the future -->
      </div>

      <h2 class="section-title">Featured Recipes</h2>
      <div class="recipe-grid">
        <div v-for="recipe in recipes" :key="recipe.name" class="recipe-card">
          <!-- Image -->
          <img
            :src="recipe.picture || '/assets/images/placeholder.jpg'"
            :alt="recipe.name"
            class="recipe-image"
          />
          <!-- Content -->
          <div class="recipe-content">
            <h3 class="recipe-title">{{ recipe.name }}</h3>
            <p class="recipe-category">
              <strong>Category:</strong> {{ recipe.category }}
            </p>
            <p class="recipe-servings">
              <strong>Servings:</strong> {{ recipe.servings }}
            </p>
            <h4>Ingredients:</h4>
            <ul class="ingredients-list">
              <li v-for="ingredient in recipe.ingredients" :key="ingredient.name">
                {{ ingredient.quantity }} {{ ingredient.unit }} {{ ingredient.name }}
              </li>
            </ul>
            <h4>Instructions:</h4>
            <p class="recipe-instructions">{{ recipe.instructions }}</p>
          </div>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<script>
export default {
  name: "HomeView",
  data() {
    return {
      recipes: []
    };
  },
  async created() {
    const response = await fetch("/recipes.json");
    this.recipes = await response.json();
  }
};
</script>

<style scoped>
/* Cooking-Inspired Colors */
  :root {
    --beige: #fffaf0;
    --green: #28a745; /* Updated green color for buttons */
    --orange: #f5a623;
    --text-dark: #333;
  }

/* Main Page Styling */
.home {
  padding: 2rem;
  background-color: var(--beige);
}

.section-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--text-dark);
  text-align: center;
  margin-bottom: 2rem;
}

/* Recipe Grid */
.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

/* Recipe Card */
.recipe-card {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.recipe-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

/* Recipe Image */
.recipe-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-bottom: 1px solid #ddd;
}

/* Recipe Content */
.recipe-content {
  padding: 1rem;
  text-align: left;
}

.recipe-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--text-dark);
}

.recipe-category,
.recipe-servings {
  font-size: 0.9rem;
  color: #555;
  margin: 0.5rem 0;
}

.ingredients-list {
  margin: 0.5rem 0;
  padding-left: 1.2rem;
  list-style-type: disc;
}

.recipe-instructions {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}
</style>