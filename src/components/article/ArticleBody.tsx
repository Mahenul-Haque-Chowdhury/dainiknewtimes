import React from "react";
import { RichText } from "@payloadcms/richtext-lexical/react";

interface ArticleBodyProps {
  content: any;
}

export default function ArticleBody({ content }: ArticleBodyProps) {
  if (!content) {
    return <p className="text-text-muted">কোনো বিষয়বস্তু নেই।</p>;
  }

  return (
    <div className="prose prose-lg max-w-none article-content">
      <RichText data={content} />
    </div>
  );
}
