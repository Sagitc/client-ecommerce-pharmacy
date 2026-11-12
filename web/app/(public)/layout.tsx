import { Suspense } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function PublicLayout({ children }: { children: React.ReactNode; }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={<div className="w-full h-16 bg-primary" />}>
        <Header />
      </Suspense>
      
      <main className="grow bg-accent">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}