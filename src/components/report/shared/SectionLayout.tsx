import React from "react";

interface SectionLayoutProps {
  children: React.ReactNode;
  className?: string;
  minHeight?: string;
  backgroundColor?: string;
  padding?: string;
}

const SectionLayout: React.FC<SectionLayoutProps> = ({
  children,
  className = "",
  minHeight = "min-h-[400px]",
  backgroundColor = "bg-gray-50",
  padding = "px-4 py-4 lg:px-12",
}) => {
  return (
    <div className={`${minHeight} ${backgroundColor} ${className}`}>
      <div className={padding}>{children}</div>
    </div>
  );
};

export default SectionLayout;
