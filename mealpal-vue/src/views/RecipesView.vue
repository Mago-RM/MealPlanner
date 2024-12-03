<template>
  <div class="recipes-container">
    <!-- Page Title -->
    <h1 class="page-title">Your Recipes</h1>

    <!-- Search Bar, Filter, and Add Recipe -->
    <div class="actions">
      <!-- Search Bar and Search Button -->
      <div class="search-wrapper">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search for recipes..."
          class="search-bar"
        />
        <button class="search-button" @click="handleSearch">
          🔍 Search
        </button>
      </div>

      <!-- Filter Dropdown -->
      <div class="filter-wrapper">
        <label for="category-filter" class="filter-label">Filter by Category:</label>
        <select
          id="category-filter"
          v-model="selectedCategory"
          class="filter-dropdown"
        >
          <option value="">All Categories</option>
          <option
            v-for="category in uniqueCategories"
            :key="category"
            :value="category"
          >
            {{ category }}
          </option>
        </select>
      </div>

      <!-- Add Recipe Button -->
      <button class="add-recipe-button" @click="handleAddRecipe">
        + Add Recipe
      </button>
    </div>

    <!-- Recipes Grid -->
    <div class="recipe-grid">
      <div v-for="recipe in filteredRecipes" :key="recipe.name" class="recipe-card">
        <!-- Recipe Image -->
        <img
          :src="recipe.picture || '/assets/images/placeholder.jpg'"
          :alt="recipe.name"
          class="recipe-image"
        />

        <!-- Recipe Content -->
        <div class="recipe-content">
          <h2 class="recipe-title">{{ recipe.name }}</h2>
          <p class="recipe-info">
            <strong>Category:</strong> {{ recipe.category }}
          </p>
          <p class="recipe-info">
            <strong>Servings:</strong> {{ recipe.servings }}
          </p>

          <h3 class="recipe-subtitle">Ingredients:</h3>
          <ul class="ingredients-list">
            <li v-for="ingredient in recipe.ingredients" :key="ingredient.name">
              {{ ingredient.quantity }} {{ ingredient.unit }} {{ ingredient.name }}
            </li>
          </ul>

          <h3 class="recipe-subtitle">Instructions:</h3>
          <p class="recipe-instructions">{{ recipe.instructions }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecipesView",
  data() {
    return {
      searchQuery: "", // Stores search input
      selectedCategory: "", // Stores selected category for filtering
      recipes: [], // Stores recipes loaded from JSON
    };
  },
  async created() {
    try {
      const response = await fetch("/recipes.json");
      if (!response.ok) {
        throw new Error("Failed to fetch recipes.");
      }
      this.recipes = await response.json();
    } catch (error) {
      console.error("Error loading recipes:", error);
    }
  },
  computed: {
    uniqueCategories() {
      // Extract unique categories from recipes
      const categories = this.recipes.map((recipe) => recipe.category);
      return [...new Set(categories)];
    },
    filteredRecipes() {
      // Filter recipes based on search query and selected category
      return this.recipes.filter((recipe) => {
        const matchesSearch =
          !this.searchQuery ||
          recipe.name.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesCategory =
          !this.selectedCategory || recipe.category === this.selectedCategory;
        return matchesSearch && matchesCategory;
      });
    },
  },
  methods: {
    handleSearch() {
      console.log("Search initiated for:", this.searchQuery);
    },
    handleAddRecipe() {
      alert("Add Recipe functionality will be implemented here.");
    },
  },
};
</script>

<style scoped>
/* Container Styling */
.recipes-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fffaf0; /* Beige background */
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Title Styling */
.page-title {
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

/* Actions (Search Bar, Filter, Add Button) */
.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
  gap: 15px;
}

/* Search Wrapper */
.search-wrapper {
  display: flex;
  align-items: center;
  flex-grow: 1;
  max-width: 500px;
}

/* Search Bar Styling */
.search-bar {
  flex-grow: 1;
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 5px 0 0 5px;
  font-size: 1rem;
}

/* Search Button */
.search-button {
  background-color: #28a745;
  color: white;
  padding: 10px 15px;
  border: none;
  font-size: 1rem;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.search-button:hover {
  background-color: #218838;
}

/* Filter Dropdown */
.filter-wrapper {
  display: flex;
  align-items: center;
}

.filter-label {
  margin-right: 10px;
  font-weight: bold;
  color: #333;
}

.filter-dropdown {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

/* Add Recipe Button */
.add-recipe-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.add-recipe-button:hover {
  background-color: #218838;
}

/* Recipes Grid */
.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

/* Recipe Card */
.recipe-card {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.recipe-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
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
  padding: 15px;
}

.recipe-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.recipe-info {
  font-size: 0.9rem;
  color: #555;
  margin: 5px 0;
}

.recipe-subtitle {
  font-size: 1rem;
  font-weight: bold;
  margin-top: 15px;
  margin-bottom: 5px;
  color: #444;
}

.ingredients-list {
  margin: 0;
  padding: 0;
  list-style-type: disc;
  padding-left: 20px;
  font-size: 0.9rem;
  color: #666;
}

.recipe-instructions {
  font-size: 0.9rem;
  color: #666;
  margin-top: 10px;
}
</style>
