
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js'
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from './views/paginationView.js'
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";
import { MODAL_CLOSE_MS } from "./config.js";

const controlRecipes = async () => {
  try {
    const id = window.location.hash.slice(1)

    if (!id) return;
    recipeView.renderSpinner();

    // Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage())

    // Update bm view
    bookmarksView.update(model.state.bookmarks)

    // Loading recipe
    await model.loadRecipe(id)

    // Rendering recipe
    recipeView.render(model.state.recipe);
  }
  catch (err) {
    recipeView.renderError()
  }
}

const controlSearchResults = async () => {
  try {
    resultsView.renderSpinner()

    // 1. Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2. Load search results
    await model.loadSearchResults(query)

    // 3. Render results
    resultsView.render(model.getSearchResultsPage());

    // 4. Render pagination buttons
    paginationView.render(model.state.search)
  }
  catch (error) {
    throw error;
  }
}

const controlPagination = (goToPage) => {
  // 3. Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 4. Render NEW pagination buttons
  paginationView.render(model.state.search)
}

const controlServings = (newSevings) => {
  // Update the recipe servings (in state)
  model.updateServings(newSevings)

  //Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = () => {
  // Add/remove bm
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe)
  }
  else {
    model.deleteBookmark(model.state.recipe.id)
  }
  // Update recipe view
  recipeView.update(model.state.recipe)
  // render bms
  bookmarksView.render(model.state.bookmarks)
}

const controlBookmarks = () => {
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async (newRecipe) => {
  try {
    // Show loading
    addRecipeView.renderSpinner();
    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    // Render recipe
    recipeView.render(model.state.recipe)
    // Success msg
    addRecipeView.renderMessage();
    // Render bm view
    bookmarksView.render(model.state.bookmarks);
    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // Close form
    setTimeout(function () {
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_MS);
  }
  catch (err) {
    addRecipeView.renderError(err.message)
  }
}

const init = () => {
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes)
  recipeView.addHandlerUpdateServings(controlServings)
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
  addRecipeView.addHandlerUpload(controlAddRecipe)
}
init()