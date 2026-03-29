export default function PdpOverlay() {
  return (
    <div className="pdp-overlay" id="pdpOverlay" aria-hidden="true">
      <div className="pdp-inner">
        <nav className="pdp-nav">
          <button className="pdp-back-btn" id="pdpBackBtn" type="button">
            ← Back
          </button>
          <div className="pdp-breadcrumb">
            <span>Home</span>
            <span className="pdp-breadcrumb-sep">›</span>
            <span id="pdpBreadcrumb" className="pdp-breadcrumb-current">
              Phone Details
            </span>
          </div>
        </nav>
        <div className="pdp-main" id="pdpMain" />
        <div className="pdp-specs-section" id="pdpSpecs" />
      </div>
    </div>
  );
}
