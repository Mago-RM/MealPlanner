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
          <button class="save-button" @click="addNewRecipe">Save</button>
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
      this.resetNewRecipe();
    },

    addIngredient() {
      this.newRecipe.ingredients.push({ name: "", quantity: 0, unit: "" });
    },

    removeIngredient(index) {
      this.newRecipe.ingredients.splice(index, 1);
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.newRecipe.picture = e.target.result; // Save the base64 image URL
        };
        reader.readAsDataURL(file);
      }
    },

    addNewRecipe() {
      const newRecipe = { ...this.newRecipe }; // Clone the recipe

      // Add to the recipes array
      this.recipes.push(newRecipe);

      // Save the updated recipes to a JSON file
      this.saveToJSON();

      // Close the modal and reset the new recipe
      this.closeModal();
    },

    saveToJSON() {
      const dataStr = JSON.stringify(this.recipes, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      // Trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = "recipes.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log("JSON file saved successfully!");
    },

    resetNewRecipe() {
      this.newRecipe = {
        name: "",
        category: "",
        servings: 1,
        ingredients: [],
        instructions: "",
        picture: null,
      };
    },
  },
};
</script>



<style scoped>
/* General Styling */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fffaf0; /* Beige background */
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.button {
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  padding: 10px 15px;
  transition: background-color 0.3s ease-in-out;
}

.button:hover {
  background-color: #218838;
}

.button-primary {
  background-color: #28a745;
  color: white;
}

.button-secondary {
  background-color: #ccc;
  color: #333;
}

.button-danger {
  background-color: #dc3545;
  color: white;
}

.button-danger:hover {
  background-color: #c82333;
}

/* Flex and Grid Containers */
.flex {
  display: flex;
  align-items: center;
  gap: 10px;
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* Responsive columns */
  gap: 15px; /* Spacing between cards */
  justify-content: center; /* Center the grid items */
  margin-top: 20px; /* Add spacing above the grid */
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Responsive columns */
  gap: 20px;
  justify-content: center; /* Center the grid items */
}

/* Form Inputs */
.input {
  width: 100%;
  padding: 0.7rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.textarea {
  height: 250px;
  resize: vertical;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}


/* Search Bar Container */
.search-wrapper {
  display: flex;
  align-items: center;
  gap: 10px; /* Add spacing between elements */
  justify-content: center; /* Center the search bar */
  width: 100%; /* Full-width container */
  margin-bottom: 20px; /* Add spacing below the search bar */
}

/* Search Bar Input */
.search-bar {
  padding: 10px 20px;
  border: 2px solid #ccc;
  border-radius: 25px 0 0 25px; /* Rounded left corners */
  font-size: 1rem;
  flex-grow: 1; /* Adjust to fill available space */
  max-width: 400px; /* Limit width for aesthetics */
  outline: none; /* Remove outline on focus */
  transition: border-color 0.3s;
}

.search-bar:focus {
  border-color: #28a745; /* Green border on focus */
}

/* Search Button */
.search-button {
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  font-size: 1rem;
  border-radius: 0 25px 25px 0; /* Rounded right corners */
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-button:hover {
  background-color: #218838;
}

/* Filter Dropdown */
.filter-dropdown {
  padding: 10px 15px;
  border: 2px solid #ccc;
  border-radius: 25px; /* Rounded corners */
  font-size: 1rem;
  background-color: white;
  transition: border-color 0.3s, box-shadow 0.3s; /* Smooth transition effects */
  outline: none;
  appearance: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow */
}

/* Add Recipe Button */
.add-recipe-button {
  background-color: #28a745; /* Green for emphasis */
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s ease-in-out;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.add-recipe-button:hover {
  background-color: #218838; /* Darker green for hover */
  transform: scale(1.05); /* Slightly enlarge on hover */
}

.add-recipe-button:active {
  background-color: #1e7d4e; /* Even darker green for active click */
  transform: scale(0.98); /* Click effect */
}

/* Recipe Card */
.recipe-card {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  width: 100%; /* Ensure the card scales */
  max-width: 300px; /* Prevent it from becoming too wide */
  margin: 0 auto; /* Center individual cards */
}

.recipe-card:hover {
  transform: translateY(-5px); /* Slight lift on hover */
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2); /* Add stronger shadow */
}

.recipe-image {
  width: 100%;
  height: 150px; /* Adjust for better layout */
  object-fit: cover;
  border-bottom: 1px solid #ddd;
}

/* Recipe Content */
.recipe-content {
  padding: 10px;
  text-align: center; /* Center-align text for cleaner look */
}

/* Recipe Title */
.recipe-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
  text-overflow: ellipsis; /* Handle long text gracefully */
  white-space: nowrap;
  overflow: hidden;
}

.card-info,
.card-subtitle {
  font-size: 0.9rem;
  color: #555;
  margin: 5px 0;
}


/* Ingredients List */
.list {
  margin: 0;
  padding: 0;
  list-style-type: disc;
  padding-left: 15px;
  font-size: 0.85rem;
  color: #666;
  max-height: 60px; /* Limit height for long ingredient lists */
  overflow: hidden; /* Hide overflowing content */
}

/* Recipe Instructions */
.recipe-instructions {
  font-size: 0.85rem;
  color: #666;
  margin-top: 10px;
  max-height: 50px; /* Limit height for long instructions */
  overflow: hidden;
  text-overflow: ellipsis;
}
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6); /* Slightly darker overlay */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Modal Box */
.modal {
  background: #fff;
  padding: 2rem;
  border-radius: 16px;
  width: 500px;
  max-height: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  animation: fadeIn 0.3s ease; /* Fade-in animation */
}

/* Modal Header */
.modal-header {
  font-size: 1.8rem;
  color: #333;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
}

/* Modal Inputs */
.modal-input {
  width: 100%;
  margin-bottom: 1rem;
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.modal-input:focus {
  border-color: #28a745; /* Highlighted border on focus */
  outline: none;
}

/* Modal Actions */
.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.save-button,
.cancel-button {
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s ease-in-out, transform 0.2s ease-in-out;
}

.save-button {
  background-color: #28a745; /* Green save button */
  color: white;
}

.save-button:hover {
  background-color: #218838;
  transform: scale(1.05);
}

.cancel-button {
  background-color: #ccc; /* Grey cancel button */
  color: #333;
}

.cancel-button:hover {
  background-color: #bbb;
  transform: scale(1.05);
}

/* File Input */
.file-input-wrapper {
  margin: 1.5rem 0;
}

.file-label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #555;
}

.file-input {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

/* Image Preview */
.image-preview img {
  width: 100%;
  height: auto;
  margin-top: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Modal Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ingredients-section {
  margin-top: 1rem;
}

.ingredients-section h4 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.ingredient-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  flex-wrap: wrap; /* Allow wrapping on smaller screens */
}

.ingredient-input {
  flex-grow: 1; /* Let the inputs take equal space */
  padding: 0.7rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.ingredient-input.quantity {
  flex: 0 1 80px; /* Fixed width for quantity */
}

.ingredient-input.unit {
  flex: 0 1 120px; /* Fixed width for unit dropdown */
}

.add-ingredient-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s, transform 0.2s ease-in-out;
}

.add-ingredient-button:hover {
  background-color: #218838;
  transform: scale(1.05); /* Slightly enlarge on hover */
}

.remove-button {
  background-color: #dc3545;
  color: white;
  padding: 0.5rem 0.7rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s ease-in-out;
}

.remove-button:hover {
  background-color: #c82333;
  transform: scale(1.05); /* Slightly enlarge on hover */
}

</style>

