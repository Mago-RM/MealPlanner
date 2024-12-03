<template>
  <div>
    <nav class="navbar">
      <h1 class="logo">MealPal</h1>
      <div class="nav-links">
        <button
          v-for="link in navLinks"
          :key="link.path"
          class="nav-button"
          @click="$router.push(link.path)"
        >
          {{ link.name }}
        </button>
      </div>
    </nav>
    <main>
      <slot />
    </main>
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
        { name: "Shopping List", path: "/shopping-list" }
      ]
    };
  }
};
</script>

<style scoped>
:root {
  --navbar-green: #28a745;
  --navbar-dark-green: #087e6d;
}
</style>

<style scoped>
/* Navbar Styling */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: var(--green); /* Green background for theme consistency */
  border-bottom: 2px solid var(--dark-green);
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Navbar Logo */
.logo {
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  font-family: 'Poppins', sans-serif;
}

/* Navbar Buttons */
.nav-links .nav-button {
  background-color: white;
  color: var(--green);
  border: 2px solid var(--green);
  padding: 0.5rem 1rem;
  border-radius: 5px;
  text-transform: uppercase;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-links .nav-button:hover {
  background-color: var(--dark-green);
  color: white;
  transform: scale(1.1);
}
</style>



