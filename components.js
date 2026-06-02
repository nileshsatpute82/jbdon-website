// JBDON News Portal + Knowledge Base - Components
// Updated for news-first homepage with working mobile menu

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
            {title: "Benchmarking", url: "knowledge/benchmarking.html"}
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
            {title: "Maslow's Hierarchy", url: "knowledge/maslows-hierarchy-of-needs.html"}
        ]
    },
    analytics: {
        name: "Analytics",
        articles: [
            {title: "Customer Analytics", url: "knowledge/customer-analytics.html"},
            {title: "A/B Testing", url: "knowledge/ab-testing-introduction.html"},
            {title: "Regression Analysis", url: "knowledge/regression-analysis.html"},
            {title: "Cluster Analysis", url: "knowledge/what-is-cluster-analysis.html"},
            {title: "Data Visualization", url: "knowledge/data-visualization.html"}
        ]
    },
    economics: {
        name: "Economics",
        articles: [
            {title: "Price Elasticity", url: "knowledge/demand-elasticity.html"},
            {title: "Demand Concepts", url: "knowledge/demand-concepts-and-analysis.html"},
            {title: "Cost Analysis I", url: "knowledge/cost-concepts-and-analysis-i.html"}
        ]
    },
    leadership: {
        name: "Leadership",
        articles: [
            {title: "Change Management", url: "knowledge/change-management.html"},
            {title: "Teamwork", url: "knowledge/collaboration-and-teamwork.html"},
            {title: "Adaptability", url: "knowledge/adaptability.html"},
            {title: "Confidence", url: "knowledge/confidence.html"}
        ]
    }
};

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
            <nav class="main-nav" id="main-nav">
                <a href="${baseUrl}index.html" class="nav-link ${!isKnowledge ? 'active' : ''}">News</a>
                <a href="${baseUrl}knowledge/" class="nav-link ${isKnowledge ? 'active' : ''}">Knowledge</a>
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
    
    <!-- Mobile Menu Overlay -->
    <div class="mobile-menu-overlay" id="mobile-menu-overlay">
        <div class="mobile-menu-content">
            <a href="${baseUrl}index.html" class="mobile-nav-link">News</a>
            <a href="${baseUrl}knowledge/" class="mobile-nav-link">Knowledge Base</a>
            <div class="mobile-menu-divider"></div>
            <div class="mobile-menu-section">
                <h4>Popular Topics</h4>
                <a href="${baseUrl}knowledge/porters-five-forces-model.html">Porter's Five Forces</a>
                <a href="${baseUrl}knowledge/swot-analysis.html">SWOT Analysis</a>
                <a href="${baseUrl}knowledge/bcg-growth-share-matrix.html">BCG Matrix</a>
                <a href="${baseUrl}knowledge/customer-analytics.html">Customer Analytics</a>
                <a href="${baseUrl}knowledge/change-management.html">Change Management</a>
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
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Knowledge</h4>
                    <ul>
                        <li><a href="${baseUrl}knowledge/">All Frameworks</a></li>
                        <li><a href="${baseUrl}knowledge/porters-five-forces-model.html">Strategy</a></li>
                        <li><a href="${baseUrl}knowledge/positioning.html">Marketing</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Connect</h4>
                    <ul>
                        <li><a href="mailto:nilesh@jbdon.com">Contact</a></li>
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
        alert('Link copied!');
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
    // Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileOverlay = document.getElementById('mobile-menu-overlay');
    
    if (mobileBtn && mobileOverlay) {
        mobileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            mobileBtn.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close when clicking overlay background
        mobileOverlay.addEventListener('click', function(e) {
            if (e.target === mobileOverlay) {
                mobileBtn.classList.remove('active');
                mobileOverlay.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
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
                searchResults.innerHTML = '<div class="search-hint">Type at least 2 characters...</div>';
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
    
    // Sidebar accordions
    document.querySelectorAll('.sidebar-cat').forEach(cat => {
        cat.addEventListener('click', function() {
            this.parentElement.classList.toggle('open');
        });
    });
}
