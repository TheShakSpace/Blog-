// Get articleId from URL query
const params = new URLSearchParams(window.location.search);
const articleId = params.get('id');

// Elements
const articleTitle = document.getElementById('article-title');
const articleMeta = document.getElementById('article-meta');
const articleContent = document.getElementById('article-content');

// Article ID to category mapping
const articleCategoryMap = {
  'day1': 'web-dev-journey.json',
  'day2': 'daily-challenges.json',
  'day3': 'daily-challenges.json',
  'day4': 'daily-challenges.json',
  'day5': 'research-learnings.json',
  'day6': 'web-dev-journey.json',
  'java-learning': 'dsa-java.json',
  'personal-life': 'personal-life.json'
};

// Load article from category JSON
async function loadArticle() {
  const categoryFile = articleCategoryMap[articleId];
  if (!categoryFile) {
    articleTitle.textContent = "Article Not Found";
    articleContent.innerHTML = "<p>Sorry, we couldn't find this article.</p>";
    return;
  }

  try {
    const response = await fetch(categoryFile);
    const articles = await response.json();
    const article = articles.find(a => a.id === articleId);

    if (!article) {
      articleTitle.textContent = "Article Not Found";
      articleContent.innerHTML = "<p>Sorry, we couldn't find this article.</p>";
      return;
    }

    articleTitle.textContent = article.title;
    articleMeta.innerHTML = `<span class="category">${article.category}</span> • <span class="read-time">${article.readTime}</span> • <span class="tags">${article.tags.join(', ')}</span>`;
    articleContent.innerHTML = article.fullContent;

  } catch (error) {
    console.error('Error loading article:', error);
    articleTitle.textContent = "Error Loading Article";
    articleContent.innerHTML = "<p>There was an error loading this article. Please try again later.</p>";
  }
}

// Generate Table of Contents
function generateTOC() {
  const articleContent = document.getElementById('article-content');
  const tocList = document.getElementById('toc-list');

  if (!articleContent || !tocList) return;

  // Clear existing TOC
  tocList.innerHTML = '';

  // Find all headings
  const headings = articleContent.querySelectorAll('h2, h3');

  headings.forEach((heading, index) => {
    const id = `heading-${index}`;
    heading.id = id;

    const level = heading.tagName.toLowerCase();
    const text = heading.textContent;

    const li = document.createElement('li');
    li.className = level === 'h3' ? 'toc-subitem' : 'toc-item';

    const link = document.createElement('a');
    link.href = `#${id}`;
    link.textContent = text;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
    });

    li.appendChild(link);
    tocList.appendChild(li);
  });
}

// Load article on page load
window.addEventListener('DOMContentLoaded', () => {
  loadArticle().then(() => {
    generateTOC();
  });
});
