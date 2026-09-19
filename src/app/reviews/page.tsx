import type { Metadata } from "next";
import { Reviews } from "@/components/home/Reviews";

export const metadata: Metadata = {
  title: "Customer Reviews",
  description: "Verified customer reviews for Detail Kings 941 auto detailing in Southwest Florida.",
};

export default function ReviewsPage() {
  return (
    <div className="pt-24">
      <Reviews />
    </div>
  );
}
