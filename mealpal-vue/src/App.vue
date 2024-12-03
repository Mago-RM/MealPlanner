<template>
  <div id="app">
    <header class="navbar">
      <h1 class="logo">MealPal</h1>
      <nav>
        <button v-for="link in navLinks" :key="link.path" class="nav-button" @click="$router.push(link.path)">
          {{ link.name }}
        </button>
      </nav>
    </header>
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      navLinks: [
        { name: "Home", path: "/" },
        { name: "Recipes", path: "/recipes" },
        { name: "Meal Planner", path: "/meal-planner" },
        { name: "Shopping List", path: "/shopping-list" },
      ],
    };
  },
};
</script>

<style>
/* Navbar styles */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.nav-button {
  margin-left: 10px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  color: white;
  background-color: #28a745; /* Green */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.nav-button:hover {
  background-color: #218838; /* Darker green for hover */
}


/* General styles */
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #fffaf0;
}

#app {
  text-align: center;
}
</style>
