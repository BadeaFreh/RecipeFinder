const RECIPES_URL = "https://recipes-goodness-elevation.herokuapp.com/recipes/ingredient/"

const express = require("express")
const dairyIngredients = require('../data/dairy-ingredients')
const glutenIngredients = require('../data/gluten-ingredients')

const router = express.Router()
const axios = require('axios')
let recipes = []

const filterAllergenRecipes = function (allergens) {
  let filteredRecipes = []
  for (let recipe of recipes) {
    let allPassed = recipe.ingredients.every(ingredient => {
      return !allergens.includes(ingredient)
    })
    if (allPassed) {
      filteredRecipes.push(recipe)
    }
  }
  recipes = filteredRecipes
}

const getRecipes = function (ingredient) {
  return axios.get(RECIPES_URL + ingredient)
}

const paginateResults = function (isDairyFree, isGlutenFree, page, limit) {
  if (isDairyFree) {
    filterAllergenRecipes(dairyIngredients)
  }
  if (isGlutenFree) {
    filterAllergenRecipes(glutenIngredients)
  }
  const startIndex = (page - 1) * limit
  const endIndex = page * limit

  const paginatedResults = {}
  if (endIndex < recipes.length - 1) {
    paginatedResults.next = {
      page: page + 1,
      limit: limit
    }
  }
  if (startIndex > 0) {
    paginatedResults.previous = {
      page: page - 1,
      limit: limit
    }
  }

  paginatedResults.results = recipes.slice(startIndex, endIndex)
  paginatedResults.totalAmountOfRecipes = recipes.length
  return paginatedResults
}

router.get("/recipes", (req, res) => {
  const isDairyFree = JSON.parse(req.query.isdairyfree)
  const isGlutenFree = JSON.parse(req.query.isglutenfree)
  const page = parseInt(req.query.page)
  const limit = parseInt(req.query.limit)
  let paginatedResults = paginateResults(isDairyFree, isGlutenFree, page, limit)
  res.send(paginatedResults)
})

router.get("/recipes/:ingredient", function (req, res) {
  const ingredient = req.params.ingredient
  getRecipes(ingredient)
    .then(response => {
      recipes = response.data.results
      res.status(200).send(recipes)
    })
})

module.exports = router