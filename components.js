/**
 * JBDON Components v5.0
 * - Design 3 Mega Menu with ALL articles
 * - Knowledge Base Sidebar - ALL 154 articles by category
 * - Elegant Share Button
 * - Premium Navy+Gold Theme
 */

// Complete article database - ALL 154 articles organized by category
const CATEGORIES = {
    analytics: {
        name: "Analytics",
        color: "#c9a962",
        articles: [
            {title: "A/B Testing Introduction", url: "ab-testing-introduction.html"},
            {title: "A/B Testing Types", url: "ab-testing-types-of-tests.html"},
            {title: "About Social Media & Web 2.0", url: "about-social-media-and-web-20.html"},
            {title: "Adding Optimization to Spreadsheet", url: "adding-optimization-to-a-spreadsheet-model.html"},
            {title: "Adding Optimization II", url: "adding-optimization-to-a-spreadsheet-model1.html"},
            {title: "Adding Uncertainty to Spreadsheet", url: "adding-uncertainty-to-a-spreadsheet-model.html"},
            {title: "Advanced Models for Decisions", url: "advanced-models-for-better-decisions.html"},
            {title: "Analyzing Qualitative Variables", url: "analyzing-qualitative-variables.html"},
            {title: "ANOVA Introduction", url: "anova-ndash-introduction.html"},
            {title: "Asking Predictive Questions", url: "asking-predictive-questions.html"},
            {title: "Basic Techniques", url: "basic-techniques.html"},
            {title: "Causal Data Collection", url: "causal-data-collection-and-summary.html"},
            {title: "Chance Constraints & VAR", url: "chance-constraints-and-value-at-risk.html"},
            {title: "Chance Constraints & VAR II", url: "chance-constraints-and-value-at-risk1.html"},
            {title: "Chart Legibility", url: "content-connection-and-chart-legitibility.html"},
            {title: "Cluster Analysis", url: "what-is-cluster-analysis.html"},
            {title: "Cluster Analysis in Excel", url: "cluster-analysis-using-excel-and-excel-miner.html"},
            {title: "Common Descriptive Statistics", url: "common-descriptive-statistics-for-quantitative-data.html"},
            {title: "Comparative Scaling", url: "comparative-scaling.html"},
            {title: "Creating & Interpreting Charts", url: "creating-and-interpreting-charts.html"},
            {title: "Customer Analytics", url: "customer-analytics.html"},
            {title: "Customer Insights", url: "customer-insights.html"},
            {title: "Customer Satisfaction", url: "customer-satisfaction.html"},
            {title: "Customer Valuation Excel", url: "customer-valuation-excel-demonstration.html"},
            {title: "Data Engine", url: "data-engine.html"},
            {title: "Data Interpretation", url: "data-interpretation.html"},
            {title: "Data Journey", url: "data-journey.html"},
            {title: "Data Reduction & Unsupervised Learning", url: "data-reduction-and-unsupervised-learning.html"},
            {title: "Data Set Predictions", url: "data-set-predictions.html"},
            {title: "Data Visualization", url: "data-visualization.html"},
            {title: "Defining Output Variables", url: "defining-output-variables-and-analyzing-the-results.html"},
            {title: "Descriptive Analytics", url: "what-is-descriptive-analytics.html"},
            {title: "Developing Spreadsheet Model", url: "developing-a-spreadsheet-model.html"},
            {title: "Displaying Distributions", url: "displaying-conditional-distributions.html"},
            {title: "Evaluating Data Access Methods", url: "evaluating-methods-of-data-access.html"},
            {title: "Evaluating Scenarios & Results", url: "evaluating-scenarios-and-visualizing-results-to-gain-practical-insights.html"},
            {title: "Excel Motion Picture Analysis", url: "excel-analysis-of-motion-picture-industry-data.html"},
            {title: "Experiment Design", url: "experiment-design-controlling-for-experimental-errors.html"},
            {title: "Formulating Optimization Problem", url: "formulating-an-optimization-problem.html"},
            {title: "Binary Optimization Problems", url: "formulation-and-solution-of-binary-optimization-problems.html"},
            {title: "Binary Optimization Problems II", url: "formulation-and-solution-of-binary-optimization-problems1.html"},
            {title: "Hierarchical & K-Means Clustering", url: "hierarchical-and-k-means-clustering.html"},
            {title: "Histograms Construction", url: "steps-in-constructing-histograms.html"},
            {title: "Historical Data Modeling", url: "using-historical-data-to-model-uncertainty.html"},
            {title: "Illustrating Customer Analytics", url: "illustrating-customer-analytics-in-excel.html"},
            {title: "Inspect Spray & Tooth Growth", url: "example--inspect-spray-and-tooth-growth.html"},
            {title: "LDA Topic Modeling", url: "lda-topic-modeling.html"},
            {title: "Logical Reasoning", url: "logical-reasoning.html"},
            {title: "Logit Model & Forecasting", url: "logit-model---binary-outome-and-forecastign-linear-regression.html"},
            {title: "ML Classification & Tagging", url: "machine-learned-classification-and-semantic-topic-tagging.html"},
            {title: "Measurements & Scaling", url: "measurements-and-scaling-techniques-ndash-introduction.html"},
            {title: "Metaheuristic Optimization", url: "metaheuristic-optimization.html"},
            {title: "Models with Correlated Variables", url: "models-with-correlated-uncertain-variables.html"},
            {title: "N-Gram & Phrase Mining", url: "n-gram---frequcy-count-and-phase-mining.html"},
            {title: "Net Promoter Score", url: "net-promoter-score-and-self-reports.html"},
            {title: "Non-Comparative Scaling", url: "non-comparative-scaling.html"},
            {title: "Optimization & Decision Making", url: "optimization-and-decision-making.html"},
            {title: "Passive Data Collection", url: "passive-data-collection.html"},
            {title: "Planning for Data Visualization", url: "planning-for-data-visualisation.html"},
            {title: "Preparing Data & Dissimilarities", url: "preparing-data-and-measuring-dissimilarities.html"},
            {title: "Primary Scales of Measurement", url: "primary-scales-of-measurement.html"},
            {title: "Probability Models", url: "probability-models.html"},
            {title: "Regression Analysis", url: "regression-analysis.html"},
            {title: "Regression Based Modeling", url: "regression-based-modeling.html"},
            {title: "Results and Predictions", url: "results-and-predictions.html"},
            {title: "Simulation Optimization", url: "simulation-optimization.html"},
            {title: "Social Media Microscope", url: "social-media-microscope.html"},
            {title: "Speed Techniques", url: "speed-techniques.html"},
            {title: "Survey Design", url: "survey-design.html"},
            {title: "Survey Overview", url: "survey-overview.html"},
            {title: "Text Summarization", url: "text-summarization.html"},
            {title: "Using Averages vs Simulation", url: "using-average-values-versus-simulation.html"},
            {title: "Visualization Component", url: "visualisation-component.html"},
            {title: "Visualization & Statistics", url: "visualisation-and-statistics-political-advertisingmovie-theater-and-data-assembly.html"},
            {title: "What-If Analysis & Sensitivity", url: "what-if-analysis-and-the-sensitivity-report.html"},
        ]
    },
    marketing: {
        name: "Marketing",
        color: "#8b4513",
        articles: [
            {title: "Buyer Behavior Models", url: "buyer-behavior-models.html"},
            {title: "Buying and Merchandising", url: "-buying-and-merchandising.html"},
            {title: "Digital Marketing Optimization", url: "digital-marketing-application-of-optimization.html"},
            {title: "Digital Marketing Optimization II", url: "digital-marketing-application-of-optimization1.html"},
            {title: "Marketing Analytics & Satisfaction", url: "marketing-analytics-and-customer-satisfaction.html"},
            {title: "Marketing Analytics II", url: "marketing-analytics-and-customer-satisfaction1.html"},
            {title: "Marketing Information System", url: "marketing-information-system.html"},
            {title: "Media Planning", url: "media-planning.html"},
            {title: "Positioning", url: "positioning.html"},
            {title: "Product Concept", url: "product-concept.html"},
            {title: "Product Life Cycle", url: "product-life-cycle.html"},
            {title: "Product Positioning Map", url: "product-positioning-map.html"},
            {title: "Social Media Manager Skills", url: "what-makes-an-exceptional-social-media-manager.html"},
            {title: "Why Trust Matters for Brands", url: "why-trust-matters-more-than-ever-for-brands.html"},
        ]
    },
    strategy: {
        name: "Strategy",
        color: "#1a2d4a",
        articles: [
            {title: "Ansoff's Matrix", url: "ansoffrsquos-matrix.html"},
            {title: "Benchmarking", url: "benchmarking.html"},
            {title: "Business Yes/No Decisions", url: "business-problems-with-yesno-decisions.html"},
            {title: "GE McKinsey Matrix", url: "ge-matrix-or-mckinsey-matrix.html"},
            {title: "Mission Statement", url: "the-mission-statement.html"},
            {title: "NPD Model", url: "npd-model.html"},
            {title: "NPD Process", url: "new-product-development-npd-process.html"},
            {title: "Porter's Five Forces", url: "porters-five-forces-model.html"},
            {title: "Porter's National Advantage", url: "porters-national-competitive-advantage-model.html"},
            {title: "Porter's Sustainable Advantage", url: "porters-sustainable-competitive-advantage-model.html"},
            {title: "Shell Directional Matrix", url: "shell-directional-policy-matrix.html"},
            {title: "Strategic Planning Process", url: "the-strategic-planning-process.html"},
            {title: "The Value Chain", url: "the-value-chain.html"},
        ]
    },
    economics: {
        name: "Economics",
        color: "#2d5a3d",
        articles: [
            {title: "Comparison of Market & Production", url: "comparison-of-market--production.html"},
            {title: "Cost Concepts & Analysis I", url: "cost-concepts-and-analysis-i.html"},
            {title: "Cost Concepts & Analysis II", url: "cost-concepts-and-analysis-ii.html"},
            {title: "Demand & Revenue Analysis", url: "demand-and-revenue-analysis.html"},
            {title: "Demand Concepts & Analysis", url: "demand-concepts-and-analysis.html"},
            {title: "Demand Elasticity", url: "demand-elasticity.html"},
            {title: "Demand Estimation & Forecasting", url: "demand-estimation-and-forecasting.html"},
            {title: "Estimation of Production & Cost", url: "estimation-of-production-and-cost-functions.html"},
            {title: "Firm Stakeholders & Objectives", url: "the-firm-stakeholders-objectives-and-decision-issues.html"},
            {title: "Forgotten Book - Modern Economy", url: "the-forgotten-book-that-helped-shape-the-modern-economy.html"},
            {title: "India's Middle Class - Fortune List", url: "indiarsquos-middle-class-figures-in-fortunersquos-top-ten-list-of-those-who-matter.html"},
            {title: "Introduction to Economics", url: "introduction.html"},
            {title: "Market Structure & Barriers", url: "market-structure-and-microbes-barriers-to-entry.html"},
            {title: "Perspective Analytics & Revenue", url: "perspective-analytics-maximize-revenue-and-market-structure-competitions.html"},
            {title: "Pricing Decisions", url: "pricing-decisions.html"},
            {title: "Pricing Strategies", url: "pricing-strategies.html"},
            {title: "Pricing Strategies II", url: "pricing-strategies1.html"},
            {title: "Pricing: Monopolistic & Oligopoly", url: "pricing-under-monopolistic-and-oligopolistic-competition.html"},
            {title: "Pricing: Competition & Monopoly", url: "pricing-under-pure-competition-and-pure-monopoly.html"},
            {title: "Production & Cost Analysis", url: "prodution-and-cost-analysis.html"},
            {title: "Production Function", url: "production-function.html"},
        ]
    },
    finance: {
        name: "Finance",
        color: "#4a5568",
        articles: [
            {title: "Human Resource Management", url: "human-resource-management.html"},
            {title: "IIMC - Indra Nooyi Story", url: "iimc-says-pepsico-ceo-indra-nooyi-was-an-average-student.html"},
            {title: "Understanding Data Growth", url: "understanding-the-growth-of-data.html"},
        ]
    },
    leadership: {
        name: "Leadership",
        color: "#744210",
        articles: [
            {title: "Adaptability", url: "adaptability.html"},
            {title: "Building Tech Startup Part 1", url: "building-your-own-start-up-technology-company-part-1.html"},
            {title: "Building Tech Startup Part 2", url: "building-your-own-start-up-technology-company-part-2.html"},
            {title: "Building Tech Startup Part 3", url: "building-your-own-start-up-technology-company-part-3.html"},
            {title: "Building Tech Startup Part 4", url: "building-your-own-start-up-technology-company-part-4.html"},
            {title: "Change Management", url: "change-management.html"},
            {title: "Collaboration & Teamwork", url: "collaboration-and-teamwork.html"},
            {title: "Communication Journey", url: "communication-journey.html"},
            {title: "Confidence", url: "confidence.html"},
            {title: "Create Innovative Organization", url: "create-an-innovative-organization.html"},
            {title: "Creative Thinking", url: "how-to-think-creatively.html"},
            {title: "Cultural Sensitivity", url: "cultural-sensitivity.html"},
            {title: "Decision Fatigue", url: "do-you-suffer-from-decision-fatigue.html"},
            {title: "Entrepreneurial Competencies", url: "entrepreneurial-competencies.html"},
            {title: "Establishing Small Enterprises", url: "establishing-small-scale-enterprises.html"},
            {title: "Institutional Interface - SME", url: "institutional-interface-for-small-scale-enterprises.html"},
            {title: "Lighthearted Project Management", url: "a-lighthearted-looks-at-project-management-and-sports-analogies.html"},
            {title: "Managing Small Enterprises", url: "management-of-new-and-small-enterprises.html"},
            {title: "Maslow's Hierarchy of Needs", url: "maslows-hierarchy-of-needs.html"},
            {title: "Modi Development Model", url: "narendra-modi-development-model-of-gujarat.html"},
            {title: "Planning Process", url: "the-planning-process.html"},
            {title: "Renewable Energy", url: "renewable-energy-is-no-longer-alternative-energy.html"},
            {title: "Small Enterprises - Getting Organized", url: "small-scale-enterprises--getting-organised.html"},
            {title: "Startup of You", url: "the-start-up-of-you.html"},
            {title: "Unlearning and Learning", url: "unlearning-and-learning.html"},
            {title: "Visual Reasoning", url: "visual-reasoning.html"},
        ]
    }
};

// Build flat list with category info for sidebar
const ALL_ARTICLES = [];
let globalIndex = 1;
Object.keys(CATEGORIES).forEach(catKey => {
    const cat = CATEGORIES[catKey];
    cat.articles.forEach(article => {
        ALL_ARTICLES.push({
            ...article,
            category: cat.name,
            categoryKey: catKey,
            index: globalIndex++
        });
    });
});

// Get current page
function getCurrentPage() {
    const path = window.location.pathname;
    return path.substring(path.lastIndexOf('/') + 1) || 'index.html';
}

// Generate Header with Mega Menu
function generateHeader() {
    return `
    <header class="header">
        <div class="header-inner">
            <a href="index.html" class="logo">JBD<span>ON</span></a>
            <nav class="main-nav">
                ${Object.keys(CATEGORIES).map(key => `
                <div class="nav-item" data-category="${key}">
                    <a class="nav-link">${CATEGORIES[key].name} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></a>
                </div>
                `).join('')}
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
                <h3 id="mega-cat-title">Categories</h3>
                <div class="mega-cat-count" id="mega-cat-count"></div>
            </div>
            <div class="mega-main">
                <div class="mega-links" id="mega-links"></div>
            </div>
        </div>
    </div>
    `;
}

// Generate Knowledge Base Sidebar - ALL articles by category
function generateSidebar() {
    const currentPage = getCurrentPage();
    
    let html = `
    <aside class="knowledge-sidebar">
        <div class="sidebar-header">
            <h2>Knowledge Base</h2>
            <div class="article-count">${ALL_ARTICLES.length} Articles</div>
        </div>
        <div class="sidebar-content">
    `;
    
    let num = 1;
    Object.keys(CATEGORIES).forEach(catKey => {
        const cat = CATEGORIES[catKey];
        html += `
            <div class="sidebar-category">
                <div class="sidebar-cat-header">${cat.name} <span>(${cat.articles.length})</span></div>
                <ul class="sidebar-articles">
        `;
        
        cat.articles.forEach(article => {
            const isActive = currentPage === article.url;
            html += `
                    <li>
                        <a href="${article.url}" class="sidebar-article-link ${isActive ? 'active' : ''}">
                            <span class="article-num">${num}</span>
                            <span class="article-title">${article.title}</span>
                        </a>
                    </li>
            `;
            num++;
        });
        
        html += `
                </ul>
            </div>
        `;
    });
    
    html += `
        </div>
    </aside>
    `;
    return html;
}

// Generate Share Button
function generateShareButton() {
    return `
    <div class="share-section">
        <span class="share-label">Share this article</span>
        <div class="share-buttons">
            <button class="share-btn" onclick="shareLinkedIn()" title="Share on LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </button>
            <button class="share-btn" onclick="shareTwitter()" title="Share on X/Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </button>
            <button class="share-btn" onclick="shareEmail()" title="Share via Email">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </button>
            <button class="share-btn" onclick="copyLink()" title="Copy Link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            </button>
        </div>
    </div>
    `;
}

// Generate Footer
function generateFooter(isHomepage = false) {
    return `
    <footer class="footer ${isHomepage ? 'homepage-footer' : ''}">
        <div class="footer-inner">
            <div class="footer-grid">
                <div class="footer-brand">
                    <div class="logo">JBD<span>ON</span></div>
                    <p>Strategic insights and timeless business wisdom for ambitious professionals and global leaders.</p>
                </div>
                <div class="footer-col">
                    <h4>Analytics</h4>
                    <ul class="footer-links">
                        <li><a href="data-visualization.html">Data Visualization</a></li>
                        <li><a href="customer-analytics.html">Customer Analytics</a></li>
                        <li><a href="ab-testing-introduction.html">A/B Testing</a></li>
                        <li><a href="regression-analysis.html">Regression Analysis</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Strategy</h4>
                    <ul class="footer-links">
                        <li><a href="porters-five-forces-model.html">Porter's Five Forces</a></li>
                        <li><a href="the-value-chain.html">Value Chain</a></li>
                        <li><a href="positioning.html">Positioning</a></li>
                        <li><a href="benchmarking.html">Benchmarking</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Economics</h4>
                    <ul class="footer-links">
                        <li><a href="pricing-strategies.html">Pricing Strategies</a></li>
                        <li><a href="demand-elasticity.html">Demand Elasticity</a></li>
                        <li><a href="cost-concepts-and-analysis-i.html">Cost Analysis</a></li>
                        <li><a href="production-function.html">Production Function</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Leadership</h4>
                    <ul class="footer-links">
                        <li><a href="change-management.html">Change Management</a></li>
                        <li><a href="adaptability.html">Adaptability</a></li>
                        <li><a href="collaboration-and-teamwork.html">Teamwork</a></li>
                        <li><a href="entrepreneurial-competencies.html">Entrepreneurship</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <span>© 2009-2026 JBDON. All rights reserved.</span>
                <span>Built for professionals who lead.</span>
            </div>
        </div>
    </footer>
    `;
}

// Generate Search Overlay
function generateSearchOverlay() {
    return `
    <div class="search-overlay" id="search-overlay">
        <button class="search-close" id="search-close" aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
        </button>
        <div class="search-container">
            <div class="search-input-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <input type="text" class="search-input" id="search-input" placeholder="Search ${ALL_ARTICLES.length} articles..." autocomplete="off">
            </div>
            <div class="search-hint">Press <kbd>ESC</kbd> to close</div>
            <div class="search-results" id="search-results"></div>
        </div>
    </div>
    `;
}

// Share functions
function shareLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=600,height=400');
}

function shareTwitter() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank', 'width=600,height=400');
}

function shareEmail() {
    const url = window.location.href;
    const title = document.title;
    window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent('Check out this article: ' + url)}`;
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        const btn = event.target.closest('.share-btn');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
        btn.style.background = 'var(--accent)';
        btn.style.color = 'var(--primary)';
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.style.color = '';
        }, 2000);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    const headerEl = document.getElementById('site-header');
    const sidebarEl = document.getElementById('site-sidebar');
    const footerEl = document.getElementById('site-footer');
    const shareEl = document.getElementById('share-buttons');
    
    const isHomepage = getCurrentPage() === 'index.html';
    
    if (headerEl) headerEl.innerHTML = generateHeader();
    if (sidebarEl) sidebarEl.innerHTML = generateSidebar();
    if (footerEl) footerEl.innerHTML = generateFooter(isHomepage);
    if (shareEl) shareEl.innerHTML = generateShareButton();
    
    document.body.insertAdjacentHTML('beforeend', generateSearchOverlay());
    
    setTimeout(initInteractions, 10);
});

function initInteractions() {
    // Mega Menu
    const navItems = document.querySelectorAll('.nav-item');
    const megaMenu = document.getElementById('mega-menu');
    const megaLinks = document.getElementById('mega-links');
    const megaCatTitle = document.getElementById('mega-cat-title');
    const megaCatCount = document.getElementById('mega-cat-count');
    
    function showMegaMenu(categoryKey) {
        const cat = CATEGORIES[categoryKey];
        if (!cat) return;
        
        megaCatTitle.textContent = cat.name;
        megaCatCount.textContent = `${cat.articles.length} articles`;
        
        // Show ALL articles in multi-column grid
        megaLinks.innerHTML = cat.articles.map(a => 
            `<a href="${a.url}">${a.title}</a>`
        ).join('');
        
        megaMenu.classList.add('active');
    }
    
    function hideMegaMenu() {
        megaMenu.classList.remove('active');
    }
    
    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            showMegaMenu(item.dataset.category);
        });
    });
    
    document.addEventListener('mousemove', (e) => {
        const header = document.querySelector('.header');
        const inHeader = header && header.contains(e.target);
        const inMega = megaMenu && megaMenu.contains(e.target);
        if (!inHeader && !inMega) hideMegaMenu();
    });
    
    // Search
    const searchBtn = document.getElementById('search-btn');
    const searchOverlay = document.getElementById('search-overlay');
    const searchClose = document.getElementById('search-close');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    function openSearch() {
        searchOverlay.classList.add('active');
        searchInput.focus();
    }
    
    function closeSearch() {
        searchOverlay.classList.remove('active');
        searchInput.value = '';
        searchResults.innerHTML = '';
    }
    
    function handleSearch() {
        const q = searchInput.value.toLowerCase().trim();
        if (!q) { searchResults.innerHTML = ''; return; }
        
        const results = ALL_ARTICLES.filter(a => 
            a.title.toLowerCase().includes(q) || 
            a.category.toLowerCase().includes(q)
        ).slice(0, 10);
        
        if (!results.length) {
            searchResults.innerHTML = '<div class="no-results">No articles found</div>';
            return;
        }
        
        searchResults.innerHTML = results.map(a => `
            <a href="${a.url}" class="search-result-item">
                <span class="search-result-category">${a.category}</span>
                <span class="search-result-title">${a.title}</span>
            </a>
        `).join('');
    }
    
    searchBtn?.addEventListener('click', openSearch);
    searchClose?.addEventListener('click', closeSearch);
    searchOverlay?.addEventListener('click', (e) => { if (e.target === searchOverlay) closeSearch(); });
    searchInput?.addEventListener('input', handleSearch);
    
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
        if (e.key === 'Escape') closeSearch();
    });
    
    // Scroll active sidebar item into view
    const activeSidebarItem = document.querySelector('.sidebar-article-link.active');
    if (activeSidebarItem) {
        setTimeout(() => {
            activeSidebarItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }
}
