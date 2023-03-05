const express = require("express")
const router = express.Router()
const API_URL = "https://recipes-goodness-elevation.herokuapp.com/recipes/ingredient/"
const axios = require('axios')

let recipesData = []
let dairyIngredients = ["Double Cream", "Cheese", "Milk", "Butter", "Creme", "Ricotta", "Mozzarella", "Custard", "Cream Cheese"]
let glutenIngredients = ["Flour", "Bread", "spaghetti", "Biscuits", "Beer"]

const filterDiaryIngredients = function () {
  let filteredRecipes = []
  let recipes = recipesData.results
  for (let recipe of recipes) {

    let allPassed = recipe.ingredients.every(ingredient => {
      return !dairyIngredients.includes(ingredient)
    })
    if (allPassed) {
      filteredRecipes.push(recipe)
    }
  }
  recipesData.results = filteredRecipes
}

const filterGlutinIngredients = function () {
  let filteredRecipes = []
  let recipes = recipesData.results
  for (let recipe of recipes) {
    let allPassed = recipe.ingredients.every(ingredient => {
      return !glutenIngredients.includes(ingredient)
    })
    if (allPassed) {
      filteredRecipes.push(recipe)
    }
  }
  recipesData.results = filteredRecipes
}

const getRecipes = function (ingredient) {
  return axios(API_URL + ingredient)
}

router.get("/recipes/:ingredient", function (req, res) {
  const ingredient = req.params.ingredient
  getRecipes(ingredient)
    .then(recipesResponse => {
      let resultsLength = recipesResponse.data.results.length
      recipesData = recipesResponse.data
      if (resultsLength === 0) {
        res.status(204).send([{
          msg: "No recipes. Maybe try another ingredients?"
        }])
      } else {
        res.status(200).send(recipesData)
      }
    })
})

router.post("/recipes", function (req, res) {
  const noDairy = req.body.nodairy
  const noGluten = req.body.nogluten
  if (noDairy) {
    filterDiaryIngredients()
  }
  if (noGluten) {
    filterGlutinIngredients()
  }
  res.status(201).send(recipesData)
})

module.exports = router