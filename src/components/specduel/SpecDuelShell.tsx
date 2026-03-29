import type { ReactNode } from "react";

import Navbar from "@/components/specduel/Navbar";
import SiteFooter from "@/components/specduel/SiteFooter";

type Props = { children: ReactNode };

export default function SpecDuelShell({ children }: Props) {
  return (
    <>
      <div className="bg-scene" />
      <div id="app">
        <Navbar />
        {children}
        <SiteFooter />
      </div>
    </>
  );
}
