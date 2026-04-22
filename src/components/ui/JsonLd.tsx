interface JsonLdProps {
  data: Record<string, unknown>;
}

export default function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

export function websiteJsonLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "দৈনিক নিউ টাইমস",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationJsonLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: "দৈনিক নিউ টাইমস",
    url: siteUrl,
    sameAs: [],
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/images/logo.png`,
    },
  };
}

export function newsArticleJsonLd({
  title,
  description,
  url,
  imageUrl,
  publishDate,
  modifiedDate,
  authorName,
  categoryName,
}: {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  publishDate: string;
  modifiedDate?: string;
  authorName?: string;
  categoryName?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description,
    url,
    ...(imageUrl && { image: [imageUrl] }),
    datePublished: publishDate,
    dateModified: modifiedDate || publishDate,
    author: {
      "@type": "Person",
      name: authorName || "দৈনিক নিউ টাইমস",
    },
    publisher: {
      "@type": "Organization",
      name: "দৈনিক নিউ টাইমস",
    },
    ...(categoryName && {
      articleSection: categoryName,
    }),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
