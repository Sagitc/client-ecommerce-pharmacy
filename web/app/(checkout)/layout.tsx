import { Suspense } from "react";
import Header from "@/components/header";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-dvh overflow-hidden flex flex-col bg-accent">
      <Suspense fallback={<div className="w-full h-16 bg-primary shrink-0" />}>
        <Header />
      </Suspense>

      <main className="flex-1 w-full flex items-center justify-center overflow-hidden p-4">
        {children}
      </main>
    </div>
  );
}
