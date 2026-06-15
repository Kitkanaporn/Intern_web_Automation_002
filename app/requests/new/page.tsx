import type { JSX } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import NewRequestForm from "@/components/NewRequestForm";

export default async function NewRequestPage(): Promise<JSX.Element> {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="flex h-screen flex-col bg-gray-50">
      <NewRequestForm />
    </main>
  );
}
