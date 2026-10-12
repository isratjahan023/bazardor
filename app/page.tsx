import { Suspense } from "react";

import Hero from "../components/Hero";
import HomeProducts from "../components/HomeProducts";
import SocialLoginNotice from "../components/SocialLoginNotice";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <Suspense fallback={null}>
        <SocialLoginNotice />
      </Suspense>

      <Hero />
      <HomeProducts />
    </main>
  );
}