import Hero from "../components/Hero";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <Hero />

      <section id="সব-পণ্য" className="scroll-mt-6 py-10">
        <h2 className="text-xl font-bold">সব পণ্য</h2>
        <p className="mt-2 text-sm text-[#667269]">
          প্রয়োজনীয় পণ্যের আজকের দাম ও পরিবর্তন
        </p>
      </section>
    </main>
  );
}