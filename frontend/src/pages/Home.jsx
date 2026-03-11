import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      {/* HERO */}
      <div className="hero">
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>

        <div className="hero-left">
          <div className="hero-badge">
            <div className="hero-badge-line"></div>
            <div className="hero-badge-text">
              Sustainable Materials Innovation
            </div>
          </div>

          <h1>
            <span className="hero-h1-accent">Engineering the Future of</span>
            <em>Eco-Intelligent</em>
            <br />
            Materials
          </h1>

          <p className="hero-desc">
            We transform natural fibers and agricultural residues into
            high-performance, sustainable materials — designed for modern
            manufacturing and a cleaner world.
          </p>

          <div className="hero-btns">
            <Link to="/products" className="btn-gold">
              Explore Our Work
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link to="/technology" className="btn-ghost">
              View Technology
            </Link>
          </div>

          <div className="hero-stats">
            <div>
              <span className="hero-stat-value">15+</span>
              <span className="hero-stat-label">Years of R&amp;D</span>
            </div>
            <div>
              <span className="hero-stat-value">200+</span>
              <span className="hero-stat-label">Projects Delivered</span>
            </div>
            <div>
              <span className="hero-stat-value">40+</span>
              <span className="hero-stat-label">Material Solutions</span>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-panel-label">Quick Navigation</div>

          <Link to="/products" className="ql-item">
            <div className="ql-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ width: 18, height: 18, color: "var(--gold)" }}
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="ql-text">
              <strong>Natural Fiber Composites</strong>
              <span>Jute, coir, hemp &amp; flax engineered materials</span>
            </div>
            <span className="ql-arrow">→</span>
          </Link>

          <Link to="/products" className="ql-item">
            <div className="ql-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ width: 18, height: 18, color: "var(--gold)" }}
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div className="ql-text">
              <strong>Agricultural Residue Materials</strong>
              <span>Rice husk, bagasse &amp; corn stover conversion</span>
            </div>
            <span className="ql-arrow">→</span>
          </Link>

          <Link to="/services" className="ql-item">
            <div className="ql-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ width: 18, height: 18, color: "var(--gold)" }}
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4l3 3" />
              </svg>
            </div>
            <div className="ql-text">
              <strong>Product Development</strong>
              <span>End-to-end sustainable product engineering</span>
            </div>
            <span className="ql-arrow">→</span>
          </Link>

          <Link to="/training" className="ql-item">
            <div className="ql-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ width: 18, height: 18, color: "var(--gold)" }}
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <div className="ql-text">
              <strong>Training Programs</strong>
              <span>Hands-on sustainable materials education</span>
            </div>
            <span className="ql-arrow">→</span>
          </Link>

          <Link to="/services" className="ql-item">
            <div className="ql-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ width: 18, height: 18, color: "var(--gold)" }}
              >
                <path d="M9 3H5a2 2 0 00-2 2v4" />
                <path d="M9 3h10a2 2 0 012 2v4" />
                <path d="M9 3v18" />
                <path d="M9 21H5a2 2 0 01-2-2V9" />
                <path d="M9 21h10a2 2 0 002-2V9" />
              </svg>
            </div>
            <div className="ql-text">
              <strong>Research Collaboration</strong>
              <span>Applied R&amp;D partnerships and innovation</span>
            </div>
            <span className="ql-arrow">→</span>
          </Link>

          <div className="hero-right-footer">
            <p>
              Interested in a specific material solution?{" "}
              <Link to="/contact">Contact our team</Link> for a tailored
              evaluation and next steps.
            </p>
          </div>
        </div>
      </div>

      {/* TRUST BAR */}
      <div className="trust-bar">
        <div className="trust-item">
          <div className="trust-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div className="trust-text">
            <strong>
              15<span>+</span>
            </strong>
            <em>Years in Sustainable Materials</em>
          </div>
        </div>
        <div className="trust-item">
          <div className="trust-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div>
          <div className="trust-text">
            <strong>
              200<span>+</span>
            </strong>
            <em>Industry Partnerships</em>
          </div>
        </div>
        <div className="trust-item">
          <div className="trust-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="trust-text">
            <strong>
              40<span>+</span>
            </strong>
            <em>Eco Material Solutions</em>
          </div>
        </div>
        <div className="trust-item">
          <div className="trust-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72" />
              <path d="M21.13 4.37c-3.72 4.35-8.94 5.66-16.88 5.85" />
              <path d="M22.75 12.27c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" />
            </svg>
          </div>
          <div className="trust-text">
            <strong>
              12<span>+</span>
            </strong>
            <em>Countries Served</em>
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <section className="about">
        <div className="section-eyebrow">About Us</div>
        <h2 className="section-title">
          Pioneering the Circular
          <br />
          Materials Economy
        </h2>
        <p className="section-desc">
          HanRia Eco Tech bridges the gap between agricultural abundance and
          industrial need — transforming organic waste streams into
          precision-engineered materials that perform, endure, and sustain.
        </p>

        <div className="about-grid">
          <div className="about-card reveal">
            <div className="about-card-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2a10 10 0 110 20 10 10 0 010-20z" />
                <path d="M12 8v4l3 3" />
              </svg>
            </div>
            <h3>Our Origin &amp; Mission</h3>
            <p>
              Founded on the conviction that industrial progress and
              environmental stewardship are not opposing forces, HanRia Eco Tech
              has spent over a decade transforming agricultural residues and
              natural fibers into scalable, performance-grade materials for
              modern manufacturing.
            </p>
          </div>
          <div className="about-card reveal reveal-d1">
            <div className="about-card-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 3H5a2 2 0 00-2 2v4" />
                <path d="M9 3h10a2 2 0 012 2v4" />
                <path d="M9 3v18" />
                <path d="M9 21H5a2 2 0 01-2-2V9" />
                <path d="M9 21h10a2 2 0 002-2V9" />
              </svg>
            </div>
            <h3>Our Approach</h3>
            <p>
              We operate at the intersection of materials science,
              sustainability, and applied engineering. Our multidisciplinary
              team combines deep domain expertise with rigorous laboratory
              research to develop eco-materials that meet the stringent demands
              of contemporary industrial applications.
            </p>
          </div>
        </div>

        <div className="about-values">
          <div className="about-value reveal">
            <h4>Scientific Rigour</h4>
            <p>
              Every material solution emerges from systematic research and
              validated performance data across multiple application
              environments.
            </p>
          </div>
          <div className="about-value reveal reveal-d1">
            <h4>Circular Design</h4>
            <p>
              We design for end-of-life from the outset — materials that return
              value to ecosystems and economies rather than adding burden.
            </p>
          </div>
          <div className="about-value reveal reveal-d2">
            <h4>Industry Partnership</h4>
            <p>
              Long-term collaboration with manufacturers, researchers, and
              institutions to drive systemic change across supply chains.
            </p>
          </div>
        </div>
      </section>

      {/* TECHNOLOGY */}
      <section className="tech-section">
        <div className="divider-ornament">
          <span>◆</span>
        </div>
        <div className="section-eyebrow">Our Technology</div>
        <h2 className="section-title">
          Where Science Meets
          <br />
          Sustainability
        </h2>
        <p className="section-desc">
          Our proprietary processing methods unlock the structural potential of
          natural raw materials — achieving mechanical properties once reserved
          for synthetics.
        </p>

        <div className="tech-grid">
          <div className="tech-item reveal">
            <div className="tech-visual">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="tech-content">
              <div className="tech-tag">Core Process</div>
              <h3>Natural Fiber Processing</h3>
              <p>
                Advanced retting, mechanical decortication, and enzymatic
                pre-treatment processes to prepare long and short natural fibers
                for composite manufacturing at industrial scale.
              </p>
            </div>
          </div>
          <div className="tech-item reveal reveal-d1">
            <div className="tech-visual">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </div>
            <div className="tech-content">
              <div className="tech-tag">Composite Engineering</div>
              <h3>Bio-Composite Fabrication</h3>
              <p>
                Thermoset and thermoplastic composite systems using natural
                fiber reinforcements, optimised for strength-to-weight ratios
                and moisture resistance across a range of structural
                applications.
              </p>
            </div>
          </div>
          <div className="tech-item reveal">
            <div className="tech-visual">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div className="tech-content">
              <div className="tech-tag">Agro Valorisation</div>
              <h3>Agricultural Waste Conversion</h3>
              <p>
                Proprietary thermal and chemical conversion pathways that
                transform rice husk silica, bagasse cellulose, and corn stover
                lignin into value-added functional material inputs.
              </p>
            </div>
          </div>
          <div className="tech-item reveal reveal-d1">
            <div className="tech-visual">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <path d="M14 2v6h6" />
                <path d="M16 13H8" />
                <path d="M16 17H8" />
                <path d="M10 9H8" />
              </svg>
            </div>
            <div className="tech-content">
              <div className="tech-tag">Additive Manufacturing</div>
              <h3>3D Printable Eco-Filaments</h3>
              <p>
                Bio-based and bio-reinforced filaments for FDM additive
                manufacturing, enabling rapid prototyping of sustainable
                components with reduced synthetic polymer dependency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="services">
        <div className="section-eyebrow">Services</div>
        <h2
          className="section-title"
          style={{ color: "#fff", marginBottom: 16 }}
        >
          What We Offer
        </h2>
        <p
          className="section-desc"
          style={{ marginBottom: 56, color: "rgba(255,255,255,0.5)" }}
        >
          Comprehensive technical services designed to accelerate your
          transition to sustainable materials — from concept to commercial
          production.
        </p>
        <div className="services-grid">
          <div className="service-card reveal">
            <div className="service-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
              </svg>
            </div>
            <h3>Product Development</h3>
            <p>
              From concept to prototype — material selection, formulation,
              testing, and scalable manufacturing support tailored to your
              product requirements and market specifications.
            </p>
          </div>
          <div className="service-card reveal reveal-d1">
            <div className="service-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 3H5a2 2 0 00-2 2v4" />
                <path d="M9 3h10a2 2 0 012 2v4" />
                <path d="M9 3v18" />
                <path d="M9 21H5a2 2 0 01-2-2V9" />
                <path d="M9 21h10a2 2 0 002-2V9" />
              </svg>
            </div>
            <h3>Research Collaboration</h3>
            <p>
              Partner with us on applied R&amp;D to accelerate sustainable
              materials and circular innovation across industries and supply
              chains — co-developing intellectual property.
            </p>
          </div>
          <div className="service-card reveal reveal-d2">
            <div className="service-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 10v6" />
                <path d="M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <h3>Training &amp; Consultancy</h3>
            <p>
              Specialist workshops and advisory services to equip your teams
              with the knowledge to adopt greener materials, processes, and
              international sustainability standards.
            </p>
          </div>
        </div>
      </section>

      {/* SUSTAINABILITY BAND */}
      <div className="sustain">
        <div className="sustain-bg-text">ECO</div>
        <div className="sustain-inner">
          <div className="sustain-eyebrow">Our Philosophy</div>
          <h2>
            Sustainability isn't a feature —
            <br />
            <em>it's the foundation.</em>
          </h2>
          <p>
            By using natural fibers and agricultural residues, we help reduce
            landfill waste and support a circular economy — where materials
            return value to communities and ecosystems rather than extracting
            from them.
          </p>
          <div className="sustain-btns">
            <Link to="/technology" className="btn-forest">
              Explore Our Technology
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link to="/contact" className="btn-outline-forest">
              Talk to the Team
            </Link>
          </div>
        </div>
      </div>

      {/* PRODUCTS OVERVIEW */}
      <section className="products">
        <div className="section-head-row">
          <div>
            <div className="section-eyebrow">Products</div>
            <h2 className="section-title">Material Categories</h2>
            <p className="section-desc">
              Select a category to explore our range of engineered eco-materials
              crafted for industrial performance.
            </p>
          </div>
          <Link to="/products" className="section-link">
            Browse All →
          </Link>
        </div>
        <div className="products-grid">
          <div className="product-card reveal">
            <div className="product-tag">Natural Fiber</div>
            <h3>Natural Fiber Composites</h3>
            <p>
              Engineered from jute, coir, hemp, and flax for structural and
              packaging applications with performance comparable to synthetic
              composites.
            </p>
            <Link to="/products" className="product-link">
              View Category
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="product-card reveal reveal-d1">
            <div className="product-tag">Agro Waste</div>
            <h3>Agricultural Residue Materials</h3>
            <p>
              Rice husk, sugarcane bagasse, and corn stover transformed into
              functional, scalable material inputs for modern manufacturing.
            </p>
            <Link to="/products" className="product-link">
              View Category
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="product-card reveal reveal-d2">
            <div className="product-tag">Eco Design</div>
            <h3>Eco Material Design</h3>
            <p>
              Sustainable material choices and responsible product decisions for
              modern manufacturing with a minimal and measurable environmental
              footprint.
            </p>
            <Link to="/products" className="product-link">
              View Category
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
        <div className="recommend-bar reveal">
          <div>
            <p>Want a product recommendation?</p>
            <span>
              Share your use case and target requirements. We'll suggest the
              ideal material category and a clear path to evaluation.
            </span>
          </div>
          <div className="recommend-btns">
            <Link to="/contact" className="btn-primary">
              Contact Us
            </Link>
            <a
              href="mailto:info@hanriaecotech.com?subject=Products%20Inquiry%20%E2%80%94%20HanRia%20Eco%20Tech"
              className="btn-secondary"
            >
              Email Products Team
            </a>
          </div>
        </div>
      </section>

      {/* TRAINING OVERVIEW */}
      <section className="training">
        <div className="divider-ornament">
          <span>◆</span>
        </div>
        <div className="section-eyebrow">Training</div>
        <h2 className="section-title">
          Professional Development
          <br />
          Programs
        </h2>
        <p className="section-desc">
          Choose a track to build hands-on knowledge across natural fibers,
          agro-waste processing, sustainable engineering, and additive
          manufacturing.
        </p>
        <div className="training-grid">
          <div className="training-card reveal">
            <div className="training-card-top">
              <div className="training-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <h3>Natural Fiber Composite Technology</h3>
                <p>
                  Learn fundamentals of natural fibers, composite structures,
                  and practical processing workflows from certified
                  practitioners.
                </p>
              </div>
            </div>
            <ul className="feature-list">
              <li>Fiber selection, preparation &amp; surface treatment</li>
              <li>Composite basics and performance factors</li>
              <li>Testing protocols and quality assurance</li>
            </ul>
          </div>
          <div className="training-card reveal reveal-d1">
            <div className="training-card-top">
              <div className="training-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </div>
              <div>
                <h3>Agro Waste Product Manufacturing</h3>
                <p>
                  Hands-on learning focused on converting agricultural residues
                  into useful material inputs and finished components.
                </p>
              </div>
            </div>
            <ul className="feature-list">
              <li>Agro waste sourcing and preprocessing methods</li>
              <li>Manufacturing process overview and workflow design</li>
              <li>Safety, repeatability and process control</li>
            </ul>
          </div>
          <div className="training-card reveal">
            <div className="training-card-top">
              <div className="training-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4l3 3" />
                </svg>
              </div>
              <div>
                <h3>Eco Material Design</h3>
                <p>
                  Design with sustainability at the core — from material
                  selection through to lifecycle responsibility and trade-off
                  analysis.
                </p>
              </div>
            </div>
            <ul className="feature-list">
              <li>Material selection for environmental impact</li>
              <li>Lifecycle thinking and trade-off assessment</li>
              <li>Sustainable design frameworks &amp; standards</li>
            </ul>
          </div>
          <div className="training-card reveal reveal-d1">
            <div className="training-card-top">
              <div className="training-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <path d="M14 2v6h6" />
                  <path d="M16 13H8" />
                  <path d="M16 17H8" />
                  <path d="M10 9H8" />
                </svg>
              </div>
              <div>
                <h3>Sustainable Product Engineering</h3>
                <p>
                  Translate material innovation into product-ready engineering
                  with full consideration of performance and manufacture.
                </p>
              </div>
            </div>
            <ul className="feature-list">
              <li>Requirements definition and trade-off thinking</li>
              <li>Prototype development and iterative process</li>
              <li>Performance validation and testing methods</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <div className="cta-section">
        <div className="cta-card reveal">
          <div className="cta-content">
            <h2>
              Let's build something
              <br />
              sustainable, together.
            </h2>
            <p>
              If you're exploring eco-material options, we'd welcome the
              opportunity to discuss your use case. Our team will help you
              evaluate material fit, performance expectations, and a clear path
              forward.
            </p>
          </div>
          <div className="cta-btns">
            <Link to="/contact" className="btn-gold">
              Contact Us
            </Link>
            <Link to="/products" className="btn-ghost">
              Browse Categories
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
