import React from "react";
import { SectionLayout } from "./index";
import QueryEditor, { QueryItem } from "../QueryEditor";
import EditableFooter from "./EditableFooter";

interface FooterInfo {
  dataSource?: string;
  period?: string;
  channel?: string;
}

interface BaseSectionLayoutProps {
  queries?: QueryItem[];
  isEditable?: boolean;
  onQueryChange?: (queries: QueryItem[]) => void;
  children: React.ReactNode;
  footer?: FooterInfo;
  onFooterUpdate?: (footer: FooterInfo) => void;
  showFooter?: boolean;
}

const BaseSectionLayout: React.FC<BaseSectionLayoutProps> = ({
  queries = [],
  isEditable = false,
  onQueryChange,
  children,
  footer,
  onFooterUpdate,
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
        <EditableFooter
          footer={footer}
          onUpdate={onFooterUpdate}
          isEditable={isEditable}
        />
      )}
    </SectionLayout>
  );
};

export default BaseSectionLayout;
