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
      <button class="add-recipe-button" @click="openAddRecipeModal">+ Add Recipe</button>
  
          <!-- Add Recipe Modal -->
    <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal">
        <h2>Add New Recipe</h2>
        <input v-model="newRecipe.name" placeholder="Recipe Name" class="modal-input" />
        <input v-model="newRecipe.category" placeholder="Category" class="modal-input" />
        <input
          v-model="newRecipe.servings"
          placeholder="Servings"
          type="number"
          class="modal-input"
        />
        <!-- Add Ingredients Section -->
      <div class="ingredients-section">
        <h4>Ingredients:</h4>
        <div v-for="(ingredient, index) in newRecipe.ingredients" :key="index" class="ingredient-row">
          <input
            type="text"
            v-model="ingredient.name"
            placeholder="Ingredient Name"
            class="ingredient-input"
          />
          <input
            type="number"
            v-model="ingredient.quantity"
            placeholder="Quantity"
            class="ingredient-input quantity"
          />
          <select v-model="ingredient.unit" class="ingredient-input unit">
            <option value="">-- Unit --</option>
            <option value="grams">grams</option>
            <option value="ml">ml</option>
            <option value="cups">cups</option>
            <option value="tablespoons">tablespoons</option>
            <option value="teaspoons">teaspoons</option>
            <option value="pieces">pieces</option>
          </select>
          <button @click="removeIngredient(index)" class="remove-button">Remove</button>
        </div>
        <button @click="addIngredient" class="add-ingredient-button">+ Add Ingredient</button>
      </div>

        <textarea
          v-model="newRecipe.instructions"
          placeholder="Instructions"
          class="modal-input instructions-textarea"
        ></textarea>

        <!-- Image Upload -->
        <div class="file-input-wrapper">
          <label for="picture-upload" class="file-label">Upload Picture:</label>
          <input
            type="file"
            id="picture-upload"
            @change="handleFileUpload"
            class="file-input"
          />
        </div>
        <div v-if="newRecipe.picture" class="image-preview">
          <img :src="newRecipe.picture" alt="Recipe Preview" />
        </div>

        <div class="modal-actions">
          <button class="cancel-button" @click="closeModal">Cancel</button>
          <button class="save-button" @click="saveNewRecipe">Save</button>
        </div>
      </div>
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

          <h3 class="recipe-subtitle">Ingredients:</h3>
          <ul class="ingredients-list">
            <li v-for="(ingredient, index) in recipe.ingredients" :key="index">
              {{ ingredient.quantity }} {{ ingredient.unit }} {{ ingredient.name }}
            </li>
          </ul>

          <p class="recipe-instructions">{{ recipe.instructions }}</p>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: "",
      selectedCategory: "",
      recipes: [],
      isModalOpen: false,
      newRecipe: {
        name: "",
        category: "",
        servings: 1,
        ingredients: [],
        instructions: "",
        picture: null,
      },
    };
  },

  async created() {
    try {
      const response = await fetch("/recipes.json");
      if (!response.ok) throw new Error("Failed to fetch recipes.");
      this.recipes = await response.json();
    } catch (error) {
      console.error("Error loading recipes:", error);
    }
  },
  computed: {
    uniqueCategories() {
      if (!this.recipes.length) return [];
      return [...new Set(this.recipes.map((recipe) => recipe.category))];
    },
    filteredRecipes() {
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
    openAddRecipeModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    addIngredient() {
      this.newRecipe.ingredients.push({ name: "", quantity: 0, unit: "" });
    },
    removeIngredient(index) {
      this.newRecipe.ingredients.splice(index, 1);
    },
    saveNewRecipe() {
      this.recipes.push({ ...this.newRecipe });
      this.closeModal();
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Adjust the size */
  gap: 20px; /* Consistent spacing between cards */
}

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

.recipe-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-bottom: 1px solid #ddd;
}

.recipe-content {
  padding: 15px;
}

.recipe-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.recipe-info,
.recipe-subtitle {
  font-size: 0.9rem;
  color: #555;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Dark overlay */
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  z-index: 1000; /* Ensure it appears above other elements */
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 500px;
  max-height: 90%; /* Ensure the modal doesn't exceed the viewport */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* Enable scrolling inside the modal if needed */
  z-index: 1100; /* Keep it above the overlay */
}

.modal h2 {
  font-size: 1.8rem;
  color: #333;
  text-align: center;
  margin-bottom: 1.5rem;
}

.modal-input,
.ingredient-input {
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.7rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}


.instructions-textarea {
 
  height: 250px; /* Further increase height */
  font-size: 1rem;
  resize: vertical;
  padding: 0.5rem; /* Add padding for better readability */
  border: 1px solid #ccc;
  border-radius: 5px;
}

.ingredient-input.quantity,
.ingredient-input.unit {
  width: 30%;
  display: inline-block;
  margin-right: 1%;
}

.ingredient-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.add-ingredient-button {
  margin-top: 10px;
  background-color: #28a745;
  color: white;
  padding: 0.3rem 0.8rem;
  font-size: 0.9rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.add-ingredient-button:hover {
  background-color: #218838;
}

.remove-button {
  background-color: #dc3545;
  color: white;
  padding: 0.4rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
}

.remove-button:hover {
  background-color: #c82333;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.cancel-button,
.save-button {
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
}

.cancel-button {
  background: #ccc;
  color: #333;
}

.save-button {
  background: #28a745;
  color: white;
}

.save-button:hover {
  background: #218838;
}

.file-input-wrapper {
  margin: 1.5rem 0;
}

.file-label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.file-input {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.image-preview img {
  width: 100%;
  height: auto;
  margin-top: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>

