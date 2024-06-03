import { cn } from "@/lib/utils";
import React from "react";

type SkeletonProps = {
  className?: string;
};

export default function Skeleton({ className }: SkeletonProps) {
  //   return <div className="h-4 w-[550px] rounded-md bg-white/5" />;
  return (
    <div className={cn("h-4 w-[550px] rounded-md bg-white/5", className)} />
  );
}
