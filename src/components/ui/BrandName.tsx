import React from "react";

interface BrandNameProps {
  variant?: "inline" | "stacked";
  className?: string;
  dailyClassName?: string;
  titleClassName?: string;
}

export default function BrandName({
  variant = "inline",
  className = "",
  dailyClassName = "",
  titleClassName = "",
}: BrandNameProps) {
  if (variant === "stacked") {
    return (
      <span className={className}>
        <span className={`block text-black ${dailyClassName}`}>দৈনিক</span>
        <span className={titleClassName}>
          <span style={{ color: "#F90404" }}>নিউ</span>{" "}
          <span style={{ color: "#167C36" }}>টাইমস</span>
        </span>
      </span>
    );
  }

  return (
    <span className={className}>
      <span style={{ color: "#000000" }}>দৈনিক</span>{" "}
      <span style={{ color: "#F90404" }}>নিউ</span>{" "}
      <span style={{ color: "#167C36" }}>টাইমস</span>
    </span>
  );
}