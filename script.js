// ======== script.js ========

// Global data storage
let allArticles = [];
let featuredArticles = [];

// Category to JSON file mapping
const categoryFiles = {
  'Web Dev Journey': 'web-dev-journey.json',
  'Daily Challenges': 'daily-challenges.json',
  'Research & Learnings': 'research-learnings.json',
  'DSA & Java': 'dsa-java.json',
  'Personal Life': 'personal-life.json'
};

// Load all articles from category JSONs
async function loadArticles() {
  allArticles = [];
  featuredArticles = [];

  for (const [category, file] of Object.entries(categoryFiles)) {
    try {
      const response = await fetch(file);
      const articles = await response.json();
      articles.forEach(article => {
        allArticles.push(article);
        // Add first article of each category as featured (or customize logic)
        if (featuredArticles.length < 2) {
          featuredArticles.push(article);
        }
      });
    } catch (error) {
      console.error(`Error loading ${file}:`, error);
    }
  }

  populateFeaturedArticles();
  populateAllArticles();
}

// Populate featured articles
function populateFeaturedArticles() {
  const featuredGrid = document.getElementById('featured-grid');
  featuredGrid.innerHTML = '';

  featuredArticles.forEach(article => {
    const articleElement = createArticleElement(article, true);
    featuredGrid.appendChild(articleElement);
  });
}

// Populate all articles
function populateAllArticles() {
  const articlesGrid = document.getElementById('articles-grid');
  articlesGrid.innerHTML = '';

  allArticles.forEach(article => {
    const articleElement = createArticleElement(article, false);
    articlesGrid.appendChild(articleElement);
  });
}

// Create article element
function createArticleElement(article, isFeatured) {
  const articleCard = document.createElement('article');
  articleCard.className = isFeatured ? 'featured-card' : 'article-card';
  articleCard.setAttribute('data-category', article.category);
  articleCard.setAttribute('data-tags', article.tags.join(','));

  articleCard.innerHTML = `
    <div class="card-image">
      ${article.imageSvg}
    </div>
    <div class="card-content">
      <h3>${article.title}</h3>
      <p>${article.shortDescription}</p>
      <div class="card-meta">
        <span class="read-time">${article.readTime}</span>
        <button class="read-more-btn" onclick="openArticle('${article.id}')">Read more →</button>
      </div>
    </div>
  `;

  return articleCard;
}

// 1. Category Filtering
const categoryLinks = document.querySelectorAll('.category-link');

categoryLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();

    // Remove 'active' class from all links
    categoryLinks.forEach(l => l.classList.remove('active'));
    // Add 'active' to clicked link
    link.classList.add('active');

    const selectedCategory = link.textContent.trim();

    // Save selected category in localStorage
    localStorage.setItem('lastCategory', selectedCategory);

    const articleCards = document.querySelectorAll('.article-card, .featured-card');

    articleCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category') || 'All Posts';
      const isFeatured = card.classList.contains('featured-card');

      // Optional: keep featured always visible
      if (isFeatured) {
        card.style.display = 'block';
      } else if (selectedCategory === 'All Posts' || cardCategory === selectedCategory) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// Load last selected category on page load
window.addEventListener('DOMContentLoaded', () => {
  loadArticles().then(() => {
    const lastCategory = localStorage.getItem('lastCategory');
    if (lastCategory) {
      const link = Array.from(categoryLinks).find(l => l.textContent.trim() === lastCategory);
      if (link) link.click();
    }
  });
});

// ======== 2. Read More Button ========
function openArticle(articleId) {
  // Redirect to articles.html with query param
  window.location.href = `articles.html?id=${articleId}`;
}

const readMoreButtons = document.querySelectorAll('.read-more-button');
readMoreButtons.forEach(button => {
  button.addEventListener('click', () => {
    const articleId = button.getAttribute('data-article-id');
    openArticle(articleId);
  });
});

// ======== 3. Search Bar Filtering (Optional) ========
const searchInput = document.querySelector('.search-input');
searchInput.addEventListener('input', e => {
  const query = e.target.value.toLowerCase();

  articleCards.forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const desc = card.querySelector('p').textContent.toLowerCase();
    const isFeatured = card.classList.contains('featured-card');

    // Keep featured visible even if it doesn't match
    if (isFeatured) return;

    if (title.includes(query) || desc.includes(query)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
});

// ======== 4. Tags Filtering (Optional) ========
const tags = document.querySelectorAll('.tag');
tags.forEach(tag => {
  tag.addEventListener('click', () => {
    const selectedTag = tag.textContent.trim().toLowerCase();

    // Highlight selected tag
    tags.forEach(t => t.classList.remove('active'));
    tag.classList.add('active');

    articleCards.forEach(card => {
      const cardTags = card.getAttribute('data-tags')?.toLowerCase() || '';
      const isFeatured = card.classList.contains('featured-card');

      if (isFeatured) return; // keep featured visible

      if (cardTags.includes(selectedTag)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});
