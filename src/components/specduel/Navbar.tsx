import Link from "next/link";

import AuthNav from "@/components/specduel/AuthNav";

export default function Navbar() {
  return (
    <nav className="site-nav">
      <Link className="logo" href="/" style={{ textDecoration: "none" }}>
        <div className="logo-mark">⚡</div>
        <span className="logo-name">SpecDuel</span>
      </Link>
      <div className="nav-right">
        <span className="nav-pill">Smart Comparison</span>
        <AuthNav />
      </div>
    </nav>
  );
}
