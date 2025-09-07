# 🍲 MealPal  

**Group Members:**  
- Margarita Rincon  

---

## 📖 Project Overview  
**MealPal** is a **meal planning application** designed to help users organize weekly meals and generate shopping lists automatically. It uses a recipe database to suggest meals and explores different programming paradigms (**OOP, Functional, Logic**) to evaluate their impact on development complexity, performance, and user experience.  

🔹 Features include:  
- 📅 Weekly meal planning  
- 🛒 Auto-generated shopping lists  
- 📂 Recipe management (recipes stored in `recipes.json`)  
- ⚡ Implemented with multiple paradigms: OOP, FP, LP  
- 🌐 Built with Vue + Vite frontend for a modern UI  

---

## 🛠️ Tech Stack  

![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)  
![Vue.js](https://img.shields.io/badge/Vue.js-35495E?logo=vue.js&logoColor=4FC08D)  
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)  
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)  
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)  
![NPM](https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=white)  

---

## 📦 Installation & Running  

1. Clone the repository
git clone https://github.com/Mago-RM/MealPlanner.git
cd mealpal-vue




## 📸 Screenshots  

**Home Screen**  
![Login](/screenshots/mp_home.png)  

**Dashboard Recipes**  
![Dashboard](/screenshots/mp_menu.png)  

**Filter Recipes**  
![Filter](/screenshots/mp_filter.png) 

**Adding Recipes**  
![Adding](/screenshots/mp_add.png) 

**Meal Planning**  
![Planning](/screenshots/mp_plan.png) 

**Generate Shopping List**  
![Shopping](/screenshots/mp_list.png) 

## Project structure

mealpal-vue/
│
├── public/            # Static assets
├── src/               # Vue source code
│   ├── components/    # Reusable components
│   ├── views/         # Main app views
│   ├── App.vue        # Root Vue component
│   └── main.js        # Entry point
│
├── recipes.json       # Recipe database
├── week_plan.json     # Weekly meal plan storage
├── weekplan.py        # Python script for alternative planning logic
├── package.json       # Dependencies & scripts
└── vite.config.js     # Vite configuration