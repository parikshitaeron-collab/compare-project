export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-eyebrow">
        <span className="eyebrow-dot" />
        AI-Powered Specs Engine
      </div>
      <h1 className="hero-title">
        <span className="word-plain">Find Your Perfect</span>
        <br />
        <span className="word-grad">Smartphone</span>
      </h1>
      <p className="hero-tagline">Compare Specs. Choose Smart.</p>
      <p className="hero-sub">
        Compare latest smartphones with real data, prices, and performance
        insights.
      </p>
      <div className="hero-stats">
        <div className="stat">
          <div className="stat-num">50+</div>
          <div className="stat-lbl">Phones</div>
        </div>
        <div className="stat">
          <div className="stat-num">4</div>
          <div className="stat-lbl">Priorities</div>
        </div>
        <div className="stat">
          <div className="stat-num">₹</div>
          <div className="stat-lbl">Budget Filter</div>
        </div>
        <div className="stat">
          <div className="stat-num">AI</div>
          <div className="stat-lbl">Insights</div>
        </div>
      </div>
    </section>
  );
}
