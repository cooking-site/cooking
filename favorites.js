// إدارة المفضلة - الإصدار النهائي المؤكد
document.addEventListener('DOMContentLoaded', function() {
    initFavorites();
    setupNavigation();
    updateFavoriteButtons();
    
    if (isFavoritesPage()) {
        renderFavoriteRecipes();
    }
});

// تهيئة المفضلة
function initFavorites() {
    if (!localStorage.getItem('favorites')) {
        localStorage.setItem('favorites', JSON.stringify([]));
    }
}

// إعداد التنقل
function setupNavigation() {
    // تحديث القائمة الجانبية النشطة
    document.querySelectorAll('.categories a').forEach(link => {
        if (link.getAttribute('href') === window.location.pathname) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// التعامل مع النقر على زر المفضلة
function handleFavoriteClick(button) {
    const recipeId = parseInt(button.getAttribute('data-id'));
    if (isNaN(recipeId)) return;
    
    toggleFavorite(recipeId);
    updateButtonState(button, recipeId);
    
    if (isFavoritesPage()) {
        renderFavoriteRecipes();
    }
}

// تبديل حالة المفضلة
function toggleFavorite(recipeId) {
    const favorites = getFavorites();
    const index = favorites.indexOf(recipeId);
    
    if (index === -1) {
        favorites.push(recipeId);
    } else {
        favorites.splice(index, 1);
    }
    
    saveFavorites(favorites);
}

// عرض الوصفات المفضلة
function renderFavoriteRecipes() {
    const container = document.getElementById('favoritesList');
    if (!container) return;
    
    const favorites = getFavorites();
    const recipes = window.allRecipes || [];
    
    container.innerHTML = '';
    
    if (favorites.length === 0) {
        container.innerHTML = createEmptyMessage();
        return;
    }
    
    favorites.forEach(id => {
        const recipe = recipes.find(r => r.id === id);
        if (recipe) {
            container.appendChild(createRecipeCard(recipe));
        }
    });
}

// إنشاء بطاقة وصفة
function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-card favorite-card';
    card.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.name}" class="recipe-img">
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
                <h4>المكونات الأساسية:</h4>
                <ul>
                    <li>أرز/خبز/معكرونة</li>
                    <li>لحوم/أسماك/خضروات</li>
                    <li>بهارات متعددة</li>
                    <li>صلصات</li>
                </ul>
            </div>
        </div>
    `;
    return card;
}

// مساعدات
function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites')) || [];
}

function saveFavorites(favorites) {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function isFavoritesPage() {
    return window.location.pathname.includes('best.html');
}

function createEmptyMessage() {
    return `
        <div class="empty-message">
            <i class="fas fa-heart-broken"></i>
            <p>لا توجد وصفات في المفضلة</p>
            <p>اضغط على ♡ لإضافة وصفات</p>
        </div>
    `;
}

// تصدير الوظائف للاستخدام العام
window.toggleFavorite = toggleFavorite;
window.handleFavoriteClick = handleFavoriteClick;
window.renderFavoriteRecipes = renderFavoriteRecipes;
