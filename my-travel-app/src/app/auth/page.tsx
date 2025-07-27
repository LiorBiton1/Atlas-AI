"use client";
import { Suspense } from "react";
import { Authentication } from "@/components/auth/Authentication";

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Authentication />
    </Suspense>
  );
}