const HEADER_CONTENT = `
<header class="site-header" id="siteHeader">
  <div class="header-container">
    <div class="nav-left">
      <a href="index.html" class="logo">
        <div class="logo-icon">
          <svg width="32" height="32" viewBox="-2 -2 36 40" fill="none" style="overflow: visible;">
            <path d="M16 2L4 8v8c0 7.732 5.04 14.96 12 16.928C23.96 30.96 28 23.732 28 16V8L16 2z" fill="var(--accent)" opacity="0.2"/>
            <path d="M16 2L4 8v8c0 7.732 5.04 14.96 12 16.928C23.96 30.96 28 23.732 28 16V8L16 2z" stroke="var(--accent)" stroke-width="1.5" fill="none"/>
            <path d="M11 16l3 3 7-7" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="logo-text">Verdant Pack</span></span>
      </a>
    </div>

    <div class="nav-center">
      <nav class="main-nav" id="mainNav">
        <ul class="nav-list">
          <li class="has-dropdown">
            <a href="index.html" class="nav-link">Home <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg></a>
            <div class="dropdown">
              <a href="index.html" class="dropdown-item">Home 1</a>
              <a href="home2.html" class="dropdown-item">Home 2</a>
            </div>
          </li>
          <li><a href="about.html" class="nav-link">About</a></li>
          <li><a href="services.html" class="nav-link">Services</a></li>
          <li><a href="pricing.html" class="nav-link">Pricing</a></li>
          <li><a href="blogs.html" class="nav-link">Blog</a></li>
          <li><a href="contact.html" class="nav-link">Contact</a></li>
          <li><a href="dashboard.html" class="nav-link">Dashboard</a></li>
        </ul>
      </nav>
    </div>

    <div class="nav-right">
      <div class="header-actions">
        <div class="auth-links">
          <a href="login.html" class="btn-outline-sm">Login</a>
        </div>
        <button class="dir-toggle" id="dirToggle" aria-label="Toggle direction">RTL</button>
        <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">
          <svg class="sun-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <svg class="moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <button class="hamburger" id="hamburger" aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </div>
  <div class="mobile-nav" id="mobileNav">
    <ul class="mobile-nav-list">
      <li><a href="index.html">Home 1</a></li>
      <li><a href="home2.html">Home 2 </a></li>
      <li><a href="about.html">About</a></li>
      <li><a href="services.html">Services</a></li>
      <li><a href="pricing.html">Pricing</a></li>
      <li><a href="blogs.html">Blog</a></li>
      <li><a href="contact.html">Contact</a></li>
      <li><a href="login.html">Login</a></li>
      <li><a href="dashboard.html" class="mobile-dashboard-link">Dashboard</a></li>
    </ul>
  </div>
</header>
`;

const FOOTER_CONTENT = `
<footer class="site-footer">
  <div class="footer-container">
    <div class="footer-brand">
      <a href="index.html" class="logo">
        <div class="logo-icon">
          <svg width="28" height="28" viewBox="-2 -2 36 40" fill="none" style="overflow: visible;">
            <path d="M16 2L4 8v8c0 7.732 5.04 14.96 12 16.928C23.96 30.96 28 23.732 28 16V8L16 2z" fill="var(--accent)" opacity="0.2"/>
            <path d="M16 2L4 8v8c0 7.732 5.04 14.96 12 16.928C23.96 30.96 28 23.732 28 16V8L16 2z" stroke="var(--accent)" stroke-width="1.5" fill="none"/>
            <path d="M11 16l3 3 7-7" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="logo-text">Verdant<span class="logo-accent">Pack</span></span>
      </a>
      <p class="footer-tagline">Packaging that gives back to the planet. Certified B-Corp, 100% compostable & recyclable solutions for forward-thinking businesses.</p>
      <div class="footer-badges">
        <span class="badge"><i data-lucide="leaf" class="icon-sm"></i> Carbon Neutral</span>
        <span class="badge"><i data-lucide="map-pin" class="icon-sm"></i> Hyderabad, India</span>
      </div>
    </div>
    <div class="footer-links">
      <div class="footer-col">
        <h4>Products</h4>
        <ul>
          <li><a href="services.html?category=compostable">Compostable Bags</a></li>
          <li><a href="services.html?category=recyclable">Recyclable Boxes</a></li>
          <li><a href="services.html?category=mailers">Eco Mailers</a></li>
          <li><a href="services.html?category=tape">Paper Tape</a></li>
          <li><a href="service-detail.html">Custom Solutions</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <ul>
          <li><a href="about.html">About Us</a></li>
          <li><a href="blogs.html">Blog</a></li>
          <li><a href="pricing.html">Pricing</a></li>
          <li><a href="contact.html">Contact</a></li>
          <li><a href="coming-soon.html">Careers</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Business</h4>
        <ul>
          <li><a href="dashboard.html">Dashboard</a></li>
          <li><a href="login.html">Login / Signup</a></li>
          <li><a href="pricing.html#volume">Volume Discounts</a></li>
          <li><a href="404.html"> 404 page</a></li>
          <li><a href="coming-soon.html">Affiliate Program</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Address</h4>
        <p>Ayyappa Society , Madhapur<br/>Hyderabad, Telangana - 500081<br/>India</p>
        <div class="social-links">
          <a href="#" aria-label="Twitter" class="social-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 01-1.93.07 4.28 4.28 0 004 2.98 8.521 8.521 0 01-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>
          </a>
          <a href="#" aria-label="LinkedIn" class="social-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
          </a>
          <a href="#" aria-label="Instagram" class="social-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
          </a>
        </div>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <div class="footer-bottom-inner">
      <p>© 2026 VerdantPack. All rights reserved.</p>
      <div class="footer-bottom-links">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Cookie Policy</a>
      </div>
    </div>
  </div>
</footer>
`;

const SERVICES_DATA = {
  'compostable': {
    title: 'Compostable Mailer Bags',
    tag: 'BPI Certified',
    category: 'Compostable',
    image: 'assets/images/compostable-bags.png',
    price: '$0.12',
    bulkPrice: '$0.08',
    description: '100% home-compostable poly mailers made from a PBAT & PLA blend. Fully certified, waterproof, tear-resistant, and shelf-stable for 12 months. Break down in a home compost pile within 180 days.',
    specs: [
      { label: 'Material', value: 'PBAT 60% / PLA 40% (Corn-based)' },
      { label: 'Compostability', value: 'Home compostable (EN 13432 & ASTM D6400)' },
      { label: 'Thickness', value: '55 microns (Heavy Duty)' },
      { label: 'Closure', value: 'Double-track Pressure-sensitive adhesive' },
      { label: 'Tensile Strength', value: '24 MPa (High Strength)' }
    ],
    faqs: [
      { q: 'Can these be printed with our logo?', a: 'Yes — soy-based ink custom printing is available for orders of 1,000+ units.' },
      { q: 'Do they work in home compost bins?', a: 'Yes! These bags are certified for home composting.' }
    ]
  },
  'recyclable': {
    title: 'Corrugated Cardboard Boxes',
    tag: 'FSC Certified',
    category: 'Recyclable',
    image: 'assets/images/recyclable-boxes.png',
    price: '$0.85',
    bulkPrice: '$0.55',
    description: '100% recycled content corrugated boxes. Double-walled for extra protection. Available in 40+ standard sizes and full custom dimensions.',
    specs: [
      { label: 'Material', value: '100% Recycled Kraft Board (FSC Certified)' },
      { label: 'Burst Strength', value: '200 lbs/sq inch (Mullen Test)' },
      { label: 'Edge Crush Test', value: '32 ECT - Standard Duty' },
      { label: 'Weight Capacity', value: 'Up to 15kg (Medium), 25kg (Large)' }
    ],
    faqs: [
      { q: 'Are these boxes waterproof?', a: 'They are moisture-resistant but not fully waterproof. For wet conditions, we recommend our compostable liners.' }
    ]
  },
  'mailers': {
    title: 'Kraft Paper Mailers',
    tag: 'Plastic-Free',
    category: 'Mailers',
    image: 'assets/images/eco-mailers.png',
    price: '$0.28',
    bulkPrice: '$0.20',
    description: 'Expandable kraft paper mailers with self-seal adhesive. Curbside recyclable, 100% paper. Reinforced edges for heavy items.',
    specs: [
      { label: 'Material', value: '100% Recycled Kraft Paper' },
      { label: 'Recyclability', value: 'Curbside Recyclable' },
      { label: 'MOQ', value: '200 units' }
    ],
    faqs: [
      { q: 'Are they padded?', a: 'We offer both padded and non-padded versions. The padded version uses recycled paper pulp instead of plastic bubble wrap.' }
    ]
  },
  'tape': {
    title: 'Paper Gummed Tape',
    tag: 'Water-Activated',
    category: 'Tape & Labels',
    image: 'assets/images/paper-tape.png',
    price: '$4.20',
    description: 'Water-activated reinforced kraft paper tape. Bond creates a tamper-evident seal. Fully recyclable with the box.',
    specs: [
      { label: 'Material', value: 'Reinforced Kraft Paper' },
      { label: 'Widths', value: '2", 3"' },
      { label: 'MOQ', value: '36 rolls' }
    ],
    faqs: []
  },
  'custom': {
    title: 'Custom Branded Boxes',
    tag: 'Best Seller',
    category: 'Custom',
    image: 'assets/images/custom-boxes.png',
    price: '$1.40',
    description: 'Full-color soy-ink printed boxes on FSC board. Our design team helps you build an unboxing experience that turns customers into advocates.',
    specs: [
      { label: 'Ink', value: 'Soy-based eco-ink' },
      { label: 'MOQ', value: '250 units' }
    ],
    faqs: []
  },
  'retail': {
    title: 'Compostable Retail Bags',
    tag: 'Home Compostable',
    category: 'Compostable',
    image: 'assets/images/retail-bags.png',
    price: '$0.09',
    description: 'High-quality handle bags for retail. 100% compostable, certified for home composting. Silky smooth texture with high load capacity.',
    specs: [
      { label: 'MOQ', value: '1000 units' }
    ],
    faqs: []
  },
  'inserts': {
    title: 'Molded Pulp Inserts',
    tag: 'New',
    category: 'Recyclable',
    image: 'assets/images/pulp-inserts.png',
    price: '$0.65',
    description: 'Precision-molded pulp inserts replacing styrofoam. 100% recycled newsprint, curbside recyclable, and nestable for storage efficiency.',
    specs: [
      { label: 'MOQ', value: '500 units' }
    ],
    faqs: []
  },
  'honeycomb': {
    title: 'Honeycomb Paper Cushion',
    tag: 'New',
    category: 'Mailers',
    image: 'assets/images/honeycomb-wrap.png',
    price: '$18.50',
    description: 'Wrapping paper replacement with beautiful hexagonal cushioning. 100% recycled kraft paper, zero plastic, and easy to dispense.',
    specs: [
      { label: 'MOQ', value: '10 rolls' }
    ],
    faqs: []
  }
};

const BLOGS_DATA = {
  'plastic-cost': {
    title: 'The True Cost of Plastic Packaging: A Business Case for Going Compostable',
    tag: 'Sustainability',
    image: 'assets/images/blog-1.png',
    author: 'Marcus Okafor',
    date: 'January 14, 2026',
    readTime: '8 min read',
    content: `
      <p class="article-lead">Every year, businesses spend billions on plastic packaging — and then spend again to dispose of it, manage customer complaints about it, and navigate ever-tightening regulations around it. The true cost of plastic is almost always underestimated.</p>
      
      <p>Beyond the environmental impact, plastic packaging carries hidden financial burdens. Procurement teams often focus on the unit price, but the life-cycle costs tell a different story. From disposal fees and extended producer responsibility (EPR) taxes to the intangible but significant loss of brand loyalty, plastic is becoming a liability on the balance sheet.</p>

      <img src="assets/images/compostable-bags.png" style="width:100%;border-radius:20px;margin:32px 0" alt="Compostable options"/>

      <h2>1. The Hidden Cost of Disposal</h2>
      <p>In many regions, EPR laws now require businesses to pay for the "end-of-life" management of their packaging. For non-recyclable plastics, these fees are skyrocketing. Businesses that switch to compostable materials often find their waste management fees slashed by up to 40% as they shift the burden back to natural biological cycles.</p>
      
      <h2>2. Consumer Sentiment & Brand Equity</h2>
      <p>Recent data shows that 74% of e-commerce shoppers are "actively frustrated" by unnecessary plastic filler. This frustration manifests as fewer repeat purchases and lower Net Promoter Scores (NPS). When you switch to compostable mailers, you're not just buying a bag — you're buying a marketing asset that reinforces your commitment to the planet every time it arrives on a doorstep.</p>

      <div class="article-callout" style="background:var(--bg2);padding:24px;border-radius:16px;border-left:4px solid var(--accent);margin:32px 0">
        <strong><i data-lucide="lightbulb" class="icon-sm"></i> Economic Case Study:</strong> A mid-size apparel brand saved $12,000 annually by switching to PBAT mailers. While the mailer's cost increased by 15%, their "Unboxing Satisfaction" scores jumped 300%, leading to a direct increase in secondary referral sales.
      </div>

      <h2>3. Regulatory Future-Proofing</h2>
      <p>Waiting for a ban to happen is an expensive strategy. Retrofitting a fulfillment line for new packaging specs takes time and testing. By making the switch now, you gain a competitive lead over competitors who will eventually scramble to find supply during the inevitable "compostable rush" when new legislation hits in 2027.</p>
    `
  },
  'composting-labels': {
    title: 'Home vs. Industrial Composting: What Your Labels Actually Mean',
    tag: 'Sustainability',
    image: 'assets/images/honeycomb-wrap.png',
    author: 'Sarah Jenkins',
    date: 'January 10, 2026',
    readTime: '5 min read',
    content: `
      <p class="article-lead">Understanding the nuance between "Home Compostable" and "Industrially Compostable" is critical for businesses that want to avoid greenwashing and genuinely contribute to a zero-waste future.</p>
      
      <p>Composting isn't a "one-size-fits-all" process. It requires the right balance of nitrogen, carbon, moisture, and heat. The certifications you choose for your packaging dictate the success of the decomposition process once it leaves your hands.</p>

      <img src="assets/images/pulp-inserts.png" style="width:100%;border-radius:20px;margin:32px 0" alt="Recyclable vs Compostable"/>

      <h2>The Industrial Standard (EN 13432)</h2>
      <p>Industrial composting facilities use high temperatures (55-60°C) and specific moisture levels to break down organic matter quickly. Some materials, like certain PLA blends, require these rigorous conditions to decompose and will not break down in a standard backyard bin. If your customers don't have access to municipal composting, these items may still end up in a landfill, where they act much like traditional plastic.</p>

      <h2>The Home compostable Gold Standard</h2>
      <p>The TUV OK Compost Home certification ensures a product will break down even in the low-temperature environment of a backyard compost pile. This is the ultimate "circular" dream.
        <ul>
          <li><strong>Disintegration:</strong> Must break down in 12 months.</li>
          <li><strong>Biodegradation:</strong> Must reach 90% in 12 months.</li>
          <li><strong>Safety:</strong> No heavy metals or toxic residuals.</li>
        </ul>
      </p>
      
      <p>Educating your customers on how to dispose of your packaging is the final piece of the puzzle. At VerdantPack, we help brands design clear disposal instructions that ensure a 100% success rate for end-of-life recovery.</p>
    `
  },
  'negotiation': {
    title: 'How to Negotiate Volume Pricing with Packaging Suppliers',
    tag: 'Business',
    image: 'assets/images/blog-hero.png',
    author: 'David Chen',
    date: 'January 7, 2026',
    readTime: '6 min read',
    content: `
      <p class="article-lead">Bulk ordering is the primary way businesses bring down their sustainable packaging costs. But getting the best rate requires more than just high volume — it requires smart negotiation.</p>
      
      <p>The packaging industry is built on efficiencies of scale. Every time a new print job is set up, it costs time and labor. Understanding how to minimize these setup costs for your supplier is useable currency for your negotiation.</p>

      <img src="assets/images/recyclable-boxes.png" style="width:100%;border-radius:20px;margin:32px 0" alt="Bulk packaging"/>

      <h2>1. The Power of Forecasting</h2>
      <p>Suppliers love predictability. If you can provide a 12-month volume forecast and commit to a blanket purchase order, the supplier can purchase raw materials in bulk at lower rates, passing the savings on to you. You don't have to take delivery of all items at once; many suppliers, including VerdantPack, offer "call-off" inventory management.</p>

      <h2>2. Standardize Your Specs</h2>
      <p>Custom sizes are expensive. If you can consolidate your shipping needs into 3 standard box sizes rather than 10, your unit cost will plummet.
        <ul>
          <li><strong>Less downtime:</strong> Machines run longer without resetting.</li>
          <li><strong>Better nesting:</strong> Optimized freight costs.</li>
          <li><strong>Lower MOQ:</strong> Suppliers are more likely to hold stock.</li>
        </ul>
      </p>

      <h2>3. Ask for Basket Pricing</h2>
      <p>Don't negotiate your mailers, tape, and boxes in isolation. Consolidating your entire packaging suite with one partner like VerdantPack allows you to negotiate a "total basket" rate that is often 15-20% lower than sourcing each component from a different vendor.</p>
    `
  },
  'pbat-vs-pla': {
    title: 'PBAT vs. PLA: Which Compostable Polymer Is Right for Your Business?',
    tag: 'Packaging Tech',
    image: 'assets/images/blog-3.png',
    author: 'Dr. Elena Rossi',
    date: 'January 3, 2026',
    readTime: '7 min read',
    content: `
      <p class="article-lead">PBAT and PLA are the workhorses of the compostable world. While they are often blended, understanding their individual properties is key to choosing the right material for your application.</p>
      
      <p>The transition from fossil-fuel plastics to bio-based polymers is one of the most exciting shifts in material science today. But not all bio-polymers are created equal.</p>

      <img src="assets/images/retail-bags.png" style="width:100%;border-radius:20px;margin:32px 0" alt="Compostable polymers"/>

      <h2>PLA: The Bio-Based Backbone</h2>
      <p>Polylactic Acid (PLA) is typically derived from fermented plant starch (corn, cassava, sugar cane). It is compostable, bio-based, and highly rigid. It’s perfect for cups, lids, and rigid trays. However, its brittleness makes it poor for flexible mailers on its own. This is where PBAT comes in.</p>

      <h2>PBAT: The Flexible Enabler</h2>
      <p>PBAT (Polybutylene adipate-co-terephthalate) is a biodegradable random copolymer. Unlike PLA, it is highly flexible and durable. While it is currently often petroleum-linked, the key is its ability to break down without leaving microplastics. When blended with PLA, it creates the "Goldilocks" material for mailers: strong enough to ship a heavy jacket, but soft enough to compost in your garden.</p>

      <h2>Choosing Your Blend</h2>
      <p>At VerdantPack, we utilize a 70/30 PBAT/PLA blend for our heavy-duty mailers. This ratio provides:
        <ul>
          <li><strong>Tear Resistance:</strong> Performance equal to traditional LDPE.</li>
          <li><strong>Shelf-Life:</strong> Stable for 12-18 months in warehouse conditions.</li>
          <li><strong>Feel:</strong> A soft, matte finish that signals luxury to the end-user.</li>
        </ul>
      </p>
      <p>The science of composting is evolving. By choosing the right blend today, you ensure your packaging performs in the real world while protecting the natural one.</p>
    `
  }
};
