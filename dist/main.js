const renderRecipes = function (recipesData) {
  $(".recipes-container").empty()
  const source = $("#recipes-template").html()
  const template = Handlebars.compile(source)
  const newHTML = template(recipesData)

  $(".recipes-container").append(newHTML);
}

$("#paginate-btn").on("click", function () {
  let pageNum = parseInt($("#page-num").val())
  let limitNum = parseInt($("#limit-num").val())
  $.ajax({
      type: "POST",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify({
        pageNum,
        limitNum
      }),
      url: "/recipes/paginate/",
    })
    .done(function (filteredRecipes) {
      console.log(filteredRecipes);
      renderRecipes(filteredRecipes)
    })

})

$("#btn").on("click", function () {
  let input = $("#ingredients-input").val()
  let noDairyChecked = $("#nodairy")[0].checked
  let glutenFreeChecked = $("#gluten-free")[0].checked
  $.get(`recipes/${input}`, function (recipes) {
      renderRecipes(recipes)
    })
    .then(_ => {
      if (noDairyChecked || glutenFreeChecked) {
        $.ajax({
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
              nodairy: noDairyChecked,
              nogluten: glutenFreeChecked
            }),
            url: "/recipes/",
          })
          .done(function (filteredRecipes) {
            renderRecipes(filteredRecipes)
          })
      }
    })

})

$("body").on("click", ".picture", function () {
  let relevantInputValue = $(this)
    .closest(".recipe-container")
    .find("li")[0].innerHTML
  alert(relevantInputValue)
})