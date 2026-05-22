
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import NotFoundSVG from "@/assets/void.svg";
export default function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center">
     
      <NotFoundSVG className="w-1/2 h-1/2" />
      <Button className="mt-4">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}
