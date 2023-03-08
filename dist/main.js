let page = 1
let limit = 3
let isDairyFree = false
let isGlutenFree = false
let paginatedResults = null

const alert1stIngredient = function (recipeImg) {
  const firstIngredient = recipeImg.closest(".recipe-container").find("li")[0].innerHTML
  alert(firstIngredient)
}

const getFilteredResults = function () {
  $.get(`/recipes?isglutenfree=${isGlutenFree}&isdairyfree=${isDairyFree}&page=${page}&limit=${limit}`)
    .done(function (filteredRecipes) {
      paginatedResults = filteredRecipes
      let numOfPages = Math.ceil(paginatedResults.totalAmountOfRecipes / limit)

      if (paginatedResults.totalAmountOfRecipes === 0) {
        renderNoContent()
      }
      else if (page < 1) {
        page = 1
        alert("This is our very first page")
      } else if (page > numOfPages) {
        page = numOfPages
        alert("You've reached the last page");
      } else {
        renderPageNumber(page, numOfPages)
        renderRecipes(filteredRecipes.results)
      }
    })
}

const requestRecipes = function (userIngredient) {
  return $.get(`recipes/${userIngredient}`, function (recipes) {
    renderRecipes(recipes)
  })
}

$(".next-btn").on("click", function () {
  page++
  getFilteredResults()
})

$(".previous-btn").on("click", function () {
  page--
  getFilteredResults()
})

$("#search-btn").on("click", function () {
  let userIngredient = $("#ingredients-input").val()
  isDairyFree = $("#isdairyfree")[0].checked
  isGlutenFree = $("#isglutenfree")[0].checked
  requestRecipes(userIngredient)
    .done(() => {
      page = 1
      getFilteredResults()
    })
})

$("body").on("click", ".picture", function () {
  alert1stIngredient($(this))
})