<template>
  <div class="meal-planner">
    <h1 class="title">Weekly Meal Plan</h1>
   
    <!-- Reset Button Container -->
    <div class="reset-button-container">
      <button class="reset-button" @click="resetWeek">Reset Week</button>
      <button class="save-button" @click="saveToJSON">Save Week</button>
    </div>

    <div class="week-grid">
      <div v-for="day in weekDays" :key="day.name" class="day-column">
        <h2 class="day-title">{{ day.name }}</h2>
        <div v-for="meal in day.meals" :key="meal.type" class="meal-card">
          <span>{{ meal.recipe || "No Recipe" }}</span>
        </div>
        <button class="add-button" @click="openModal(day.name)">+</button>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal">
        <h2>Add Recipe for {{ selectedDay }}</h2>
        <select v-model="selectedMealType">
          <option disabled value="">Select Meal Type</option>
          <option v-for="type in mealTypes" :key="type" :value="type">{{ type }}</option>
        </select>
        <select v-model="selectedRecipe">
          <option disabled value="">Select Recipe</option>
          <option v-for="recipe in recipes" :key="recipe.name" :value="recipe.name">{{ recipe.name }}</option>
        </select>
        <div class="modal-actions">
          <button class="cancel-button" @click="closeModal">Cancel</button>
          <button class="save-button" @click="addMeal">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      weekDays: [], // Start with an empty array
      recipes: [], // List of all recipes from recipes.json
      isModalOpen: false,
      selectedDay: null,
      selectedMealType: "",
      selectedRecipe: "",
      mealTypes: ["Breakfast", "Lunch", "Dinner", "Snacks", "Beverages"],
    };
  },
  async created() {
    const savedWeekPlan = localStorage.getItem("weekDays");
    if (savedWeekPlan) {
      this.weekDays = JSON.parse(savedWeekPlan);
    } else {
      this.weekDays = [
        { name: "Monday", meals: [] },
        { name: "Tuesday", meals: [] },
        { name: "Wednesday", meals: [] },
        { name: "Thursday", meals: [] },
        { name: "Friday", meals: [] },
        { name: "Saturday", meals: [] },
        { name: "Sunday", meals: [] },
      ];
    }

    const response = await fetch("/recipes.json");
    this.recipes = await response.json();
  },
  computed: {
    // Filter recipes for a search bar or dropdown
    filteredRecipes() {
      return this.recipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(this.selectedRecipe.toLowerCase())
      );
    },
  },
  watch: {
    weekDays: {
      deep: true,
      handler(newWeekDays) {
        localStorage.setItem("weekDays", JSON.stringify(newWeekDays));
      },
    },
  },
  methods: {
    openModal(day) {
      this.selectedDay = day;
      this.isModalOpen = true;
    },
    closeModal() {
      this.selectedDay = null;
      this.selectedMealType = "";
      this.selectedRecipe = "";
      this.isModalOpen = false;
    },
    addMeal() {
      const day = this.weekDays.find((d) => d.name === this.selectedDay);
      const meal = day.meals.find((m) => m.type === this.selectedMealType);
      if (meal) {
        meal.recipe = this.selectedRecipe;
      } else {
        day.meals.push({ type: this.selectedMealType, recipe: this.selectedRecipe });
      }
      this.closeModal();
    },
    resetWeek() {
      this.weekDays.forEach((day) => {
        day.meals = [];
      });
    },
    saveToJSON() {
      // Save week plan
      const weekPlanBlob = new Blob([JSON.stringify(this.weekDays, null, 2)], {
        type: "application/json",
      });
      const weekPlanUrl = URL.createObjectURL(weekPlanBlob);
      const weekPlanLink = document.createElement("a");
      weekPlanLink.href = weekPlanUrl;
      weekPlanLink.download = "week_plan.json";
      document.body.appendChild(weekPlanLink);
      weekPlanLink.click();
      document.body.removeChild(weekPlanLink);
      URL.revokeObjectURL(weekPlanUrl);

      // Save recipes
      const recipesBlob = new Blob([JSON.stringify(this.recipes, null, 2)], {
        type: "application/json",
      });
      const recipesUrl = URL.createObjectURL(recipesBlob);
      const recipesLink = document.createElement("a");
      recipesLink.href = recipesUrl;
      recipesLink.download = "recipes.json";
      document.body.appendChild(recipesLink);
      recipesLink.click();
      document.body.removeChild(recipesLink);
      URL.revokeObjectURL(recipesUrl);

      console.log("Week plan and recipes JSON files saved successfully!");
    },
  },
};
</script>

<style scoped>
.meal-planner {
  padding: 2rem;
  background-color: var(--beige);
}

.title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.week-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1rem;
}

.day-column {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.day-title {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.meal-card {
  background-color: var(--green);
  color: white;
  border-radius: 4px;
  padding: 0.5rem;
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: var(--text-green);
}

.add-button {
  background-color: var(--green);
  color: rgb(34, 176, 12);
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 0.5rem;
  transition: background-color 0.3s ease;
}

.add-button:hover {
  background-color: #1e7d4e; /* Slightly darker green */
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Dark overlay */
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Modal Content */
.modal {
  background: white; /* Use white background for content */
  color: var(--text-dark); /* Ensure text color is readable */
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  width: 300px;
}

/* Modal Button Style */
button {
  background-color: var(--green); /* Same green as nav bar */
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #087e6d; /* Darker green for hover */
}

/* Dropdown Styling */
select {
  background-color: white; /* White background */
  border: 2px solid var(--green); /* Green border */
  color: var(--text-dark); /* Dark text */
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 5px;
  outline: none;
  transition: background-color 0.3s, color 0.3s;
}

/* Highlight selected option */
select option {
  background-color: white; /* Default white background */
  color: var(--text-dark); /* Dark text */
}

select option:checked {
  background-color: var(--green); /* Green background for selected option */
  color: white; /* White text for contrast */
}

.modal-actions {
  display: flex;
  justify-content: space-between;
}

.save-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.save-button:hover {
  background-color: #218838;
}

.cancel-button {
  background-color: #ccc;
  color: black;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-button:hover {
  background-color: #bbb;
}

.reset-button {
  background-color: #dc3545; /* Bootstrap danger red */
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 1rem;
  margin-left: 0; /* Align to the left */
}

.reset-button:hover {
  background-color: #a71d2a; /* Darker red on hover */
}

.reset-button-container {
  display: flex;
  justify-content: flex-start; /* Align button to the left */
  margin-bottom: 1rem;
}

/* Save Button Styling */
.save-button {
  background-color: #28a745; /* Green button */
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.save-button:hover {
  background-color: #1e7d4e; /* Slightly darker green */
}

/* Adjust color variables if necessary */
:root {
  --green: #28a745;
  --text-dark: #333;
  --subtle-orange: #fbe8cc;
  --beige: #fffaf0;
  --dark-green: #1e7d4e;
}
</style>
