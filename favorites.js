document.addEventListener('DOMContentLoaded', function() {
    // Initialize favorites if not exists
    if (!localStorage.getItem('favorites')) {
        localStorage.setItem('favorites', JSON.stringify([]));
    }

    // Update favorite buttons' state
    updateFavoriteButtons();

    // Add click event listeners to favorite buttons
    document.querySelectorAll('.favorite-btn, .asian-favorite-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const recipeId = parseInt(this.getAttribute('data-id'));
            toggleFavorite(recipeId);
            this.classList.toggle('favorited');
            this.innerHTML = this.classList.contains('favorited') ? 
                '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
            
            // Re-render favorites if on favorites page
            if (window.location.pathname.includes('best.html')) {
                renderFavoriteRecipes(window.allRecipes || []);
            }
        });
    });
});

// Toggle favorite status
function toggleFavorite(recipeId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    recipeId = parseInt(recipeId);
    
    if (favorites.includes(recipeId)) {
        favorites = favorites.filter(id => id !== recipeId);
    } else {
        favorites.push(recipeId);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Update favorite buttons' state
function updateFavoriteButtons() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
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

// Render favorite recipes (used in best.html)
function renderFavoriteRecipes(recipes) {
    const favoritesContainer = document.getElementById('favoritesList');
    if (!favoritesContainer) return;

    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const filteredRecipes = recipes.filter(recipe => favorites.includes(parseInt(recipe.id)));

    favoritesContainer.innerHTML = '';

    if (filteredRecipes.length === 0) {
        favoritesContainer.innerHTML = `
            <div class="empty-message" style="grid-column:1/-1;text-align:center;padding:2rem;">
                <i class="fas fa-heart-broken" style="font-size:3rem;color:#E74C3C;margin-bottom:1rem;"></i>
                <p>لا توجد وصفات في قائمة المفضلة لديك</p>
                <p>اضغط على زر ♡ في أي وصفة لإضافتها هنا</p>
            </div>
        `;
        return;
    }

    filteredRecipes.forEach(recipe => {
        const recipeElement = document.createElement('div');
        recipeElement.className = 'recipe-card';
        recipeElement.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.name}" class="recipe-img">
            <button class="favorite-btn favorited" data-id="${recipe.id}">
                <i class="fas fa-heart"></i>
            </button>
            <div class="recipe-content">
                <h3 class="recipe-title">${recipe.name}</h3>
                <div class="recipe-meta">
                    <span><i class="fas fa-utensils"></i> ${recipe.category}</span>
                    <span><i class="fas fa-clock"></i> ${recipe.time}</span>
                </div>
                <button class="view-btn" onclick="viewRecipe(${recipe.id})">شاهد الوصفة</button>
            </div>
        `;
        favoritesContainer.appendChild(recipeElement);
    });

    // Update buttons after rendering
    updateFavoriteButtons();
}

// View recipe details
function viewRecipe(recipeId) {
    const recipe = (window.allRecipes || []).find(r => r.id === parseInt(recipeId));
    if (recipe) {
        localStorage.setItem('selectedRecipe', JSON.stringify(recipe));
        window.location.href = `recipe.html?id=${recipeId}`;
    }
}
