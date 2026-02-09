import { redirect } from "next/navigation";

export default function RootPage() {
  // For now, redirect to login page
  // In production, check auth state and redirect accordingly
  redirect("/login");
}
