"use client";

import { useEffect, useState } from "react";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/app/components/common/Cimage";
import incrementView from "@/app/actions/incrementView";
import styles from "./article.module.css";

const slugify = (s) =>
  String(s).toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").slice(0, 80);

const HeadingRenderer = ({ tag: Tag, children, ...rest }) => {
  const text = Array.isArray(children) ? children.join("") : String(children || "");
  const id = slugify(text);
  return <Tag id={id} {...rest}>{children}</Tag>;
};

const enhancedComponents = {
  ...mdxComponents,
  h2: (props) => <HeadingRenderer tag="h2" {...props} />,
  h3: (props) => <HeadingRenderer tag="h3" {...props} />,
};

const ArticleBody = ({ source, slug }) => {
  const [mdx, setMdx] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    serialize(source || "", { mdxOptions: { remarkPlugins: [remarkGfm] } })
      .then((r) => { if (alive) setMdx(r); })
      .catch((e) => { if (alive) setError(String(e)); });
    incrementView(slug).catch(() => {});
    return () => { alive = false; };
  }, [source, slug]);

  if (error) return <p style={{ color: "crimson" }}>Failed to render article.</p>;
  if (!mdx) return <p style={{ color: "var(--site-text-muted)" }}>Loading…</p>;

  return (
    <div className={styles.articleBody}>
      <MDXRemote {...mdx} components={enhancedComponents} />
    </div>
  );
};

export default ArticleBody;
