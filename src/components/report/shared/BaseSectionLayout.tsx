import React from "react";
import { SectionLayout, ReportFooter } from "./index";
import QueryEditor, { QueryItem } from "../QueryEditor";

interface BaseSectionLayoutProps {
  queries?: QueryItem[];
  isEditable?: boolean;
  onQueryChange?: (queries: QueryItem[]) => void;
  children: React.ReactNode;
  period?: string;
  channels?: string[];
  showFooter?: boolean;
}

const BaseSectionLayout: React.FC<BaseSectionLayoutProps> = ({
  queries = [],
  isEditable = false,
  onQueryChange,
  children,
  period = "Apr - Jun 2025",
  channels = [],
  showFooter = true,
}) => {
  return (
    <SectionLayout>
      {queries.length > 0 && (
        <QueryEditor
          queries={queries}
          isEditable={isEditable}
          onChange={onQueryChange || (() => {})}
        />
      )}
      {children}
      {showFooter && (
        <ReportFooter period={period} channels={channels.join(", ")} />
      )}
    </SectionLayout>
  );
};

export default BaseSectionLayout;
