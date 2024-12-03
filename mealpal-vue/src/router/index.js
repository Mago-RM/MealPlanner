import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView
  },
  {
    path: "/recipes",
    name: "Recipes",
    component: () => import("../views/RecipesView.vue")
  },
  {
    path: "/meal-planner",
    name: "MealPlanner",
    component: () => import("../views/MealPlannerView.vue")
  },
  {
    path: "/shopping-list",
    name: "ShoppingList",
    component: () => import("../views/ShoppingListView.vue")
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

