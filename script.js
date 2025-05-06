// إدارة المفضلة
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة المفضلة إذا لم تكن موجودة
    if (!localStorage.getItem('favorites')) {
        localStorage.setItem('favorites', JSON.stringify([]));
    }
    
    // تحديث أزرار القلب
    updateFavoriteButtons();
    
    // إضافة حدث النقر لأزرار القلب
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const recipeId = this.getAttribute('data-id');
            toggleFavorite(recipeId);
            this.classList.toggle('favorited');
            this.innerHTML = this.classList.contains('favorited') ? 
                '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
        });
    });
});

function toggleFavorite(recipeId) {
    const favorites = JSON.parse(localStorage.getItem('favorites'));
    const index = favorites.indexOf(recipeId);
    
    if (index === -1) {
        favorites.push(recipeId);
    } else {
        favorites.splice(index, 1);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function updateFavoriteButtons() {
    const favorites = JSON.parse(localStorage.getItem('favorites'));
    
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const recipeId = btn.getAttribute('data-id');
        
        if (favorites.includes(recipeId)) {
            btn.classList.add('favorited');
            btn.innerHTML = '<i class="fas fa-heart"></i>';
        }
    });
}

// البحث عن الوصفات
document.querySelector('.search-bar button').addEventListener('click', function() {
    const searchTerm = document.querySelector('.search-bar input').value.toLowerCase();
    const recipeCards = document.querySelectorAll('.recipe-card');
    
    recipeCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        if (title.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
		
    });
});