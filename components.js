// JBDON News Portal + Knowledge Base - Components
// Updated for news-first homepage

const CATEGORIES = {
    strategy: {
        name: "Strategy",
        articles: [
            {title: "Porter's Five Forces Model", url: "knowledge/porters-five-forces-model.html"},
            {title: "SWOT Analysis", url: "knowledge/swot-analysis.html"},
            {title: "BCG Growth-Share Matrix", url: "knowledge/bcg-growth-share-matrix.html"},
            {title: "Ansoff's Matrix", url: "knowledge/ansoffrsquos-matrix.html"},
            {title: "The Value Chain", url: "knowledge/the-value-chain.html"},
            {title: "GE/McKinsey Matrix", url: "knowledge/ge-matrix-or-mckinsey-matrix.html"},
            {title: "Strategic Planning Process", url: "knowledge/the-strategic-planning-process.html"},
            {title: "Mission Statement", url: "knowledge/the-mission-statement.html"},
            {title: "Benchmarking", url: "knowledge/benchmarking.html"},
            {title: "Shell Directional Matrix", url: "knowledge/shell-directional-policy-matrix.html"},
            {title: "Porter's Generic Strategies", url: "knowledge/porters-sustainable-competitive-advantage-model.html"},
            {title: "Porter's National Competitive Advantage", url: "knowledge/porters-national-competitive-advantage-model.html"}
        ]
    },
    marketing: {
        name: "Marketing",
        articles: [
            {title: "Positioning", url: "knowledge/positioning.html"},
            {title: "Product Life Cycle", url: "knowledge/product-life-cycle.html"},
            {title: "NPD Process", url: "knowledge/new-product-development-npd-process.html"},
            {title: "Buyer Behavior Models", url: "knowledge/buyer-behavior-models.html"},
            {title: "Pricing Strategies", url: "knowledge/pricing-strategies.html"},
            {title: "Maslow's Hierarchy", url: "knowledge/maslows-hierarchy-of-needs.html"},
            {title: "Marketing Information System", url: "knowledge/marketing-information-system.html"},
            {title: "Media Planning", url: "knowledge/media-planning.html"},
            {title: "Product Positioning Map", url: "knowledge/product-positioning-map.html"},
            {title: "NPD Model", url: "knowledge/npd-model.html"}
        ]
    },
    analytics: {
        name: "Analytics",
        articles: [
            {title: "Customer Analytics", url: "knowledge/customer-analytics.html"},
            {title: "A/B Testing", url: "knowledge/ab-testing-introduction.html"},
            {title: "Regression Analysis", url: "knowledge/regression-analysis.html"},
            {title: "Cluster Analysis", url: "knowledge/what-is-cluster-analysis.html"},
            {title: "Data Visualization", url: "knowledge/data-visualization.html"},
            {title: "Survey Design", url: "knowledge/survey-design.html"},
            {title: "Optimization", url: "knowledge/optimization-and-decision-making.html"},
            {title: "Descriptive Analytics", url: "knowledge/what-is-descriptive-analytics.html"}
        ]
    },
    economics: {
        name: "Economics",
        articles: [
            {title: "Price Elasticity", url: "knowledge/demand-elasticity.html"},
            {title: "Demand Concepts", url: "knowledge/demand-concepts-and-analysis.html"},
            {title: "Cost Analysis I", url: "knowledge/cost-concepts-and-analysis-i.html"},
            {title: "Cost Analysis II", url: "knowledge/cost-concepts-and-analysis-ii.html"},
            {title: "Production Function", url: "knowledge/production-function.html"},
            {title: "Pricing Decisions", url: "knowledge/pricing-decisions.html"}
        ]
    },
    leadership: {
        name: "Leadership",
        articles: [
            {title: "Change Management", url: "knowledge/change-management.html"},
            {title: "Teamwork", url: "knowledge/collaboration-and-teamwork.html"},
            {title: "Adaptability", url: "knowledge/adaptability.html"},
            {title: "Confidence", url: "knowledge/confidence.html"},
            {title: "Entrepreneurial Competencies", url: "knowledge/entrepreneurial-competencies.html"},
            {title: "The Start-Up of You", url: "knowledge/the-start-up-of-you.html"}
        ]
    }
};

const NEWS_CATEGORIES = [
    {name: "Strategy & M&A", id: "strategy-ma"},
    {name: "Startup & VC", id: "startup-vc"},
    {name: "Markets & Economy", id: "markets"},
    {name: "Leadership & Careers", id: "leadership"},
    {name: "Tech & AI", id: "tech-ai"}
];

function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    return page;
}

function isKnowledgePage() {
    return window.location.pathname.includes('/knowledge/');
}

function generateHeader() {
    const isKnowledge = isKnowledgePage();
    const baseUrl = isKnowledge ? '../' : '';
    
    return `
    <header class="header">
        <div class="header-inner">
            <a href="${baseUrl}index.html" class="logo">JBD<span>ON</span></a>
            <nav class="main-nav">
                <div class="nav-item">
                    <a href="${baseUrl}index.html" class="nav-link ${!isKnowledge ? 'active' : ''}">News</a>
                </div>
                <div class="nav-item" data-category="knowledge">
                    <a href="${baseUrl}knowledge/" class="nav-link ${isKnowledge ? 'active' : ''}">Knowledge <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></a>
                </div>
            </nav>
            <div class="header-actions">
                <button class="search-btn" id="search-btn" aria-label="Search">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                    </svg>
                </button>
                <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Menu">
                    <span></span><span></span><span></span>
                </button>
            </div>
        </div>
    </header>
    <div class="mega-menu" id="mega-menu">
        <div class="mega-menu-inner">
            <div class="mega-sidebar">
                <h3>Knowledge Base</h3>
                <div class="mega-cat-count">150+ Articles</div>
            </div>
            <div class="mega-main">
                <div class="mega-links" id="mega-links">
                    ${Object.keys(CATEGORIES).map(key => `
                        <div class="mega-col">
                            <h4>${CATEGORIES[key].name}</h4>
                            <ul>
                                ${CATEGORIES[key].articles.slice(0,6).map(a => 
                                    `<li><a href="${baseUrl}${a.url}">${a.title}</a></li>`
                                ).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </div>`;
}

function generateSidebar() {
    const baseUrl = isKnowledgePage() ? '' : 'knowledge/';
    
    return `
    <aside class="sidebar">
        <div class="sidebar-section">
            <h3 class="sidebar-title">Knowledge Categories</h3>
            <ul class="sidebar-menu">
                ${Object.keys(CATEGORIES).map(key => `
                    <li class="sidebar-item">
                        <span class="sidebar-cat">${CATEGORIES[key].name}</span>
                        <ul class="sidebar-sub">
                            ${CATEGORIES[key].articles.map(a => 
                                `<li><a href="${baseUrl}${a.url.replace('knowledge/','')}">${a.title}</a></li>`
                            ).join('')}
                        </ul>
                    </li>
                `).join('')}
            </ul>
        </div>
    </aside>`;
}

function generateFooter(isHomepage) {
    const baseUrl = isKnowledgePage() ? '../' : '';
    
    return `
    <footer class="footer">
        <div class="footer-inner">
            <div class="footer-brand">
                <a href="${baseUrl}index.html" class="footer-logo">JBD<span>ON</span></a>
                <p>Business news and knowledge for management professionals</p>
            </div>
            <div class="footer-links">
                <div class="footer-col">
                    <h4>News</h4>
                    <ul>
                        <li><a href="${baseUrl}index.html">Latest News</a></li>
                        <li><a href="#">Strategy & M&A</a></li>
                        <li><a href="#">Startup & VC</a></li>
                        <li><a href="#">Markets</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Knowledge</h4>
                    <ul>
                        <li><a href="${baseUrl}knowledge/">All Frameworks</a></li>
                        <li><a href="${baseUrl}knowledge/porters-five-forces-model.html">Strategy</a></li>
                        <li><a href="${baseUrl}knowledge/positioning.html">Marketing</a></li>
                        <li><a href="${baseUrl}knowledge/customer-analytics.html">Analytics</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Connect</h4>
                    <ul>
                        <li><a href="mailto:nilesh@jbdon.com">Contact</a></li>
                        <li><a href="#">Newsletter</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2025 JBDON. For management students and professionals.</p>
        </div>
    </footer>`;
}

function generateShareButton() {
    return `
    <div class="share-section">
        <span class="share-label">Share this article</span>
        <div class="share-buttons">
            <button class="share-btn" onclick="shareTwitter()" aria-label="Share on Twitter">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </button>
            <button class="share-btn" onclick="shareLinkedIn()" aria-label="Share on LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </button>
            <button class="share-btn" onclick="copyLink()" aria-label="Copy link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            </button>
        </div>
    </div>`;
}

function generateSearchOverlay() {
    const baseUrl = isKnowledgePage() ? '../' : '';
    
    const allArticles = [];
    Object.keys(CATEGORIES).forEach(key => {
        CATEGORIES[key].articles.forEach(a => {
            allArticles.push({...a, category: CATEGORIES[key].name, url: baseUrl + a.url});
        });
    });
    
    return `
    <div class="search-overlay" id="search-overlay">
        <div class="search-container">
            <div class="search-header">
                <input type="text" class="search-input" id="search-input" placeholder="Search articles..." autocomplete="off">
                <button class="search-close" id="search-close">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
            </div>
            <div class="search-results" id="search-results"></div>
        </div>
    </div>`;
}

function shareTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(document.title);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
}

function shareLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link copied to clipboard!');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const headerEl = document.getElementById('site-header');
    const sidebarEl = document.getElementById('site-sidebar');
    const footerEl = document.getElementById('site-footer');
    const shareEl = document.getElementById('share-buttons');
    
    const currentPage = getCurrentPage();
    const isHomepage = currentPage === 'index.html' && !isKnowledgePage();
    
    if (headerEl) headerEl.innerHTML = generateHeader();
    if (sidebarEl) sidebarEl.innerHTML = generateSidebar();
    if (footerEl) footerEl.innerHTML = generateFooter(isHomepage);
    if (shareEl) shareEl.innerHTML = generateShareButton();
    
    document.body.insertAdjacentHTML('beforeend', generateSearchOverlay());
    
    setTimeout(initInteractions, 10);
});

function initInteractions() {
    // Knowledge Mega Menu
    const knowledgeNav = document.querySelector('[data-category="knowledge"]');
    const megaMenu = document.getElementById('mega-menu');
    
    if (knowledgeNav && megaMenu) {
        knowledgeNav.addEventListener('mouseenter', () => {
            megaMenu.classList.add('active');
        });
        
        knowledgeNav.addEventListener('mouseleave', (e) => {
            if (!megaMenu.contains(e.relatedTarget)) {
                megaMenu.classList.remove('active');
            }
        });
        
        megaMenu.addEventListener('mouseleave', () => {
            megaMenu.classList.remove('active');
        });
    }
    
    // Search
    const searchBtn = document.getElementById('search-btn');
    const searchOverlay = document.getElementById('search-overlay');
    const searchClose = document.getElementById('search-close');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (searchBtn && searchOverlay) {
        searchBtn.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            searchInput.focus();
        });
        
        searchClose.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
        });
        
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                searchOverlay.classList.remove('active');
            }
        });
        
        const baseUrl = isKnowledgePage() ? '../' : '';
        const allArticles = [];
        Object.keys(CATEGORIES).forEach(key => {
            CATEGORIES[key].articles.forEach(a => {
                allArticles.push({...a, category: CATEGORIES[key].name, url: baseUrl + a.url});
            });
        });
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (query.length < 2) {
                searchResults.innerHTML = '<div class="search-hint">Type at least 2 characters to search...</div>';
                return;
            }
            
            const matches = allArticles.filter(a => 
                a.title.toLowerCase().includes(query) || 
                a.category.toLowerCase().includes(query)
            ).slice(0, 10);
            
            if (matches.length === 0) {
                searchResults.innerHTML = '<div class="search-no-results">No articles found</div>';
                return;
            }
            
            searchResults.innerHTML = matches.map(a => `
                <a href="${a.url}" class="search-result-item">
                    <span class="search-result-cat">${a.category}</span>
                    <span class="search-result-title">${a.title}</span>
                </a>
            `).join('');
        });
    }
    
    // Mobile menu
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileBtn && mainNav) {
        mobileBtn.addEventListener('click', () => {
            mobileBtn.classList.toggle('active');
            mainNav.classList.toggle('active');
        });
    }
    
    // Sidebar accordions
    document.querySelectorAll('.sidebar-cat').forEach(cat => {
        cat.addEventListener('click', function() {
            this.parentElement.classList.toggle('open');
        });
    });
}
