document.addEventListener('DOMContentLoaded', function() {
    // Initialize favorites if not exists
    if (!localStorage.getItem('favorites')) {
        localStorage.setItem('favorites', JSON.stringify([]));
    }

    // Update favorite buttons' state
    updateFavoriteButtons();

    // Add click event listeners to favorite buttons
    const buttons = document.querySelectorAll('.favorite-btn, .asian-favorite-btn');
    if (buttons.length === 0) {
        console.warn('No favorite buttons found with classes .favorite-btn or .asian-favorite-btn');
    }
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            const recipeId = parseInt(this.getAttribute('data-id'));
            if (isNaN(recipeId)) {
                console.error('Invalid data-id on button:', this);
                return;
            }
            toggleFavorite(recipeId);
            updateFavoriteButtons(); // تحديث جميع أزرار القلب في الصفحة فورًا
        });
    });
});

// Toggle favorite status
function toggleFavorite(recipeId) {
    console.log('Toggling favorite for recipe ID:', recipeId);
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    recipeId = parseInt(recipeId, 10); // تحويل إلى عدد صحيح
    
    if (isNaN(recipeId)) {
        console.error('Invalid recipe ID:', recipeId);
        return;
    }

    if (favorites.includes(recipeId)) {
        favorites = favorites.filter(id => id !== recipeId);
        console.log('Removed from favorites:', recipeId);
    } else {
        favorites.push(recipeId);
        console.log('Added to favorites:', recipeId);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    console.log('Current favorites:', favorites);
}

// Update favorite buttons' state
function updateFavoriteButtons() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const buttons = document.querySelectorAll('.favorite-btn, .asian-favorite-btn');
    if (buttons.length === 0) {
        console.warn('No favorite buttons found during update');
    }
    buttons.forEach(btn => {
        const recipeId = parseInt(btn.getAttribute('data-id'));
        if (isNaN(recipeId)) {
            console.error('Invalid data-id on button:', btn);
            return;
        }
        if (favorites.includes(recipeId)) {
            btn.classList.add('favorited');
            btn.innerHTML = '<i class="fas fa-heart"></i>';
            btn.style.color = '#E74C3C'; // لون القلب المشع
        } else {
            btn.classList.remove('favorited');
            btn.innerHTML = '<i class="far fa-heart"></i>';
            btn.style.color = ''; // إزالة اللون
        }
    });
}

// Render favorite recipes (used in best.html)
function renderFavoriteRecipes(recipes) {
    const favoritesContainer = document.getElementById('favoritesList');
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (!favoritesContainer) {
        console.warn('Favorites container not found');
        return;
    }

    favoritesContainer.innerHTML = '';

    if (favorites.length === 0) {
        favoritesContainer.innerHTML = `
            <div class="empty-message">
                <i class="fas fa-heart-broken" style="font-size:3rem;color:#E74C3C;margin-bottom:1rem;"></i>
                <p>لا توجد وصفات في قائمة المفضلة لديك</p>
                <p>اضغط على زر ♡ في أي وصفة لإضافتها هنا</p>
            </div>
        `;
        return;
    }

    favorites.forEach(recipeId => {
        const recipe = recipes.find(r => r.id === recipeId);
        if (recipe) {
            const recipeElement = document.createElement('div');
            recipeElement.className = 'favorite-recipe';
            recipeElement.innerHTML = `
                <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">
                <div class="recipe-details">
                    <h3 class="recipe-title">${recipe.name}</h3>
                    <div class="recipe-meta">
                        <span><i class="fas fa-utensils"></i> ${recipe.category}</span>
                        <span><i class="fas fa-clock"></i> ${recipe.time}</span>
                    </div>
                    <div class="recipe-ingredients">
                        <h4>المكونات:</h4>
                        <ul class="ingredients-list">
                            ${recipe.ingredients ? recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('') : '<li>غير متوفر</li>'}
                        </ul>
                    </div>
                </div>
                <button class="remove-favorite" onclick="removeFromFavorites(${recipe.id})">
                    <i class="fas fa-times"></i>
                </button>
            `;
            favoritesContainer.appendChild(recipeElement);
        }
    });
}

// Remove recipe from favorites
function removeFromFavorites(recipeId) {
    toggleFavorite(recipeId);
    updateFavoriteButtons();
    // Re-render favorites if on favorites page
    if (document.getElementById('favoritesList')) {
        renderFavoriteRecipes(allRecipes || []); // استخدام allRecipes المحلي أو مصفوفة فارغة كبديل
    }
}