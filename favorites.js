// Initialize favorites
function initFavorites() {
    if (!localStorage.getItem('favorites')) {
        localStorage.setItem('favorites', JSON.stringify([]));
    }
}

// Toggle favorite status
function toggleFavorite(recipeId) {
    initFavorites();
    let favorites = JSON.parse(localStorage.getItem('favorites'));
    recipeId = parseInt(recipeId);
    
    const index = favorites.indexOf(recipeId);
    if (index === -1) {
        favorites.push(recipeId);
    } else {
        favorites.splice(index, 1);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteButtons();
    
    // Re-render if on favorites page
    if (window.location.pathname.includes('best.html')) {
        renderFavoriteRecipes(window.allRecipes || []);
    }
}

// Update favorite buttons
function updateFavoriteButtons() {
    initFavorites();
    const favorites = JSON.parse(localStorage.getItem('favorites'));
    
    document.querySelectorAll('.favorite-btn, .asian-favorite-btn').forEach(btn => {
        const recipeId = parseInt(btn.getAttribute('data-id'));
        if (favorites.includes(recipeId)) {
            btn.classList.add('favorited');
            btn.innerHTML = '<i class="fas fa-heart"></i>';
        } else {
            btn.classList.remove('favorited');
            btn.innerHTML = '<i class="far fa-heart"></i>';
        }
    });
}

// Render favorite recipes
function renderFavoriteRecipes(recipes) {
    const favoritesContainer = document.getElementById('favoritesList');
    if (!favoritesContainer) return;

    initFavorites();
    const favorites = JSON.parse(localStorage.getItem('favorites'));
    const filteredRecipes = recipes.filter(recipe => 
        recipe && favorites.includes(parseInt(recipe.id))
        .sort((a, b) => a.name.localeCompare(b.name));

    favoritesContainer.innerHTML = '';

    if (filteredRecipes.length === 0) {
        favoritesContainer.innerHTML = `
            <div class="empty-message">
                <i class="fas fa-heart-broken"></i>
                <p>لا توجد وصفات في المفضلة</p>
                <p>اضغط على ♡ لإضافة وصفات</p>
            </div>
        `;
        return;
    }

    filteredRecipes.forEach(recipe => {
        const recipeElement = document.createElement('div');
        recipeElement.className = 'recipe-card favorite-card';
        recipeElement.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.name}">
            <button class="favorite-btn favorited" data-id="${recipe.id}">
                <i class="fas fa-heart"></i>
            </button>
            <div class="recipe-info">
                <h3>${recipe.name}</h3>
                <div class="recipe-meta">
                    <span><i class="fas fa-utensils"></i> ${recipe.category}</span>
                    <span><i class="fas fa-clock"></i> ${recipe.time}</span>
                </div>
                <div class="recipe-ingredients">
                    <h4>المكونات:</h4>
                    <ul>
                        <li>أرز</li>
                        <li>خضروات</li>
                        <li>بهارات</li>
                        <li>لحوم/أسماك</li>
                        <li>صلصات</li>
                    </ul>
                </div>
            </div>
        `;
        favoritesContainer.appendChild(recipeElement);
    });

    // Add event listeners to new buttons
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleFavorite(this.getAttribute('data-id'));
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initFavorites();
    updateFavoriteButtons();
    
    // Initial render for favorites page
    if (window.location.pathname.includes('best.html') && window.allRecipes) {
        renderFavoriteRecipes(window.allRecipes);
    }
});
