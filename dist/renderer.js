const renderRecipes = function (recipesData) {
    $(".recipes-container").empty()
    const source = $("#recipes-template").html()
    const template = Handlebars.compile(source)
    const newHTML = template({
        results: recipesData
    })
    $(".recipes-container").append(newHTML);
}

const renderPageNumber = function (pageNumber, totalNumberOfPages) {
    $(".page-number").empty()
    $(".page-number").append(`Page: ${pageNumber} / ${totalNumberOfPages}`)
}

const renderNoContent = function () {
    $(".recipes-container").empty()
    $(".recipes-container").append("<p class=no-content-msg>No Results :'(<br> Try another ingredients :D</p>")

}