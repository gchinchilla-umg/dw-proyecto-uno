// Wait for DOM content to load
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize database
    const initialized = await window.dbOperations.initDatabase();
    if (!initialized) {
        console.error('Failed to initialize database');
        return;
    }

    // Load and display news
    loadNews();
});

// Function to load and display news
async function loadNews() {
    try {
        const newsContainer = document.querySelector('.news-container');
        if (!newsContainer) return;

        // Get latest news from database
        const result = window.dbOperations.getLatestNews();
        
        if (result && result.length > 0 && result[0].values.length > 0) {
            const newsHTML = result[0].values.map(([fecha, noticia]) => {
                const formattedDate = new Date(fecha).toLocaleDateString('es-GT', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                
                return `
                    <article class="news-item">
                        <div class="news-date">${formattedDate}</div>
                        <div class="news-content">${noticia}</div>
                    </article>
                `;
            }).join('');
            
            newsContainer.innerHTML = newsHTML;
        } else {
            newsContainer.innerHTML = '<p>No hay noticias disponibles.</p>';
        }
    } catch (error) {
        console.error('Error loading news:', error);
        const newsContainer = document.querySelector('.news-container');
        if (newsContainer) {
            newsContainer.innerHTML = '<p>Error al cargar las noticias. Por favor, intente más tarde.</p>';
        }
    }
}
