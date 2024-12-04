<template>
  <BaseLayout>
    <div class="home">
      <!-- Meal Schedule Section -->
      <div class="meal-schedule">
        <h2 class="section-title">Meal Schedule for the Week</h2>
        <div class="schedule-grid">
          <div v-for="day in weekDays" :key="day.name" class="schedule-column">
            <h3 class="day-name">{{ day.name }}</h3>
            <ul>
              <li v-for="meal in day.meals" :key="meal.type">
                <strong>{{ meal.type }}:</strong> {{ meal.recipe || "No Recipe" }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Featured Recipes Section -->
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
      recipes: [],
      weekDays: [], // To store the weekly schedule
    };
  },
  async created() {
    try {
      // Fetch featured recipes
      const responseRecipes = await fetch("/recipes.json");
      if (responseRecipes.ok) {
        this.recipes = await responseRecipes.json();
      } else {
        console.error("Failed to fetch recipes.");
      }

      // Fetch weekly meal schedule
      const responseSchedule = await fetch("/week_plan.json");
      if (responseSchedule.ok) {
        this.weekDays = await responseSchedule.json();
      } else {
        console.error("Failed to fetch week plan.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
};
</script>

<style scoped>
/* Colors */
:root {
  --beige: #fffaf0;
  --green: #28a745;
  --text-dark: #333;
}

/* Main Page Styling */
.home {
  padding: 2rem;
  background-color: var(--beige);
}

/* Section Title */
.section-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--text-dark);
  text-align: center;
  margin-bottom: 2rem;
}

/* Meal Schedule Section */
.meal-schedule {
  margin-bottom: 2rem;
  padding: 2rem;
  background-color: var(--beige);
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.schedule-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1rem;
}

.schedule-column {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.day-name {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  font-size: 0.9rem;
  margin: 0.5rem 0;
  color: var(--text-dark);
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

