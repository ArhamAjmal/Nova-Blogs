'use client';

import dynamic from 'next/dynamic';
import React, { useRef, useState } from 'react';
// import 'react-mde/lib/styles/css/react-mde-all.css'; // Fallback styling
import '@mdxeditor/editor/style.css'; // MDXEditor styles

// Import all necessary plugins
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  tablePlugin,
  imagePlugin,
  linkPlugin,
  linkDialogPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  frontmatterPlugin,
  diffSourcePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from '@mdxeditor/editor';

// Dynamically import MDXEditor to avoid SSR issues
const MDXEditor = dynamic(() => import('@mdxeditor/editor').then((mod) => mod.MDXEditor), {
  ssr: false,
});

// Custom toolbar component
const CustomToolbar = ({ editorRef }) => {
  // State to track the active button
  const [activeButton, setActiveButton] = useState(null);

  // Helper function to handle button click, set active state, and maintain focus
  const handleButtonClick = (markdown, buttonName) => {
    if (editorRef.current) {
      editorRef.current.insertMarkdown(markdown);
      setActiveButton(buttonName); // Set the clicked button as active
      editorRef.current.focus(); // Restore focus to the editor
    }
  };

  // Common button style
  const buttonStyle = (buttonName) => ({
    padding: "5px 10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    cursor: "pointer",
    backgroundColor: activeButton === buttonName ? "#007bff" : "#fff",
    color: activeButton === buttonName ? "#fff" : "#000",
  });

  return (
    <div style={{
      display: "flex",
      gap: "10px",
      padding: "10px",
      backgroundColor: "#f5f5f5",
      borderBottom: "1px solid #ddd",
      borderRadius: "4px 4px 0 0",
      flexWrap: "wrap",
    }}>
      <button
        onClick={() => handleButtonClick('# ', 'h1')}
        style={buttonStyle('h1')}
      >
        H1
      </button>
      <button
        onClick={() => handleButtonClick('## Heading 2', 'h2')}
        style={buttonStyle('h2')}
      >
        H2
      </button>
      <button
        onClick={() => handleButtonClick('### Heading 3', 'h3')}
        style={buttonStyle('h3')}
      >
        H3
      </button>
      <button
        onClick={() => handleButtonClick('**Bold**', 'bold')}
        style={buttonStyle('bold')}
      >
        Bold
      </button>
      <button
        onClick={() => handleButtonClick('*Italic*', 'italic')}
        style={buttonStyle('italic')}
      >
        Italic
      </button>
      <button
        onClick={() => handleButtonClick('~~Strikethrough~~', 'strikethrough')}
        style={buttonStyle('strikethrough')}
      >
        Strikethrough
      </button>
      <button
        onClick={() => handleButtonClick('- List Item\n- List Item', 'unorderedList')}
        style={buttonStyle('unorderedList')}
      >
        Unordered List
      </button>
      <button
        onClick={() => handleButtonClick('1. List Item\n2. List Item', 'orderedList')}
        style={buttonStyle('orderedList')}
      >
        Ordered List
      </button>
      <button
        onClick={() => handleButtonClick('- [ ] Task Item\n- [x] Task Item', 'taskList')}
        style={buttonStyle('taskList')}
      >
        Task List
      </button>
      <button
        onClick={() => handleButtonClick('> Block Quote', 'quote')}
        style={buttonStyle('quote')}
      >
        Quote
      </button>
      <button
        onClick={() => handleButtonClick('`Inline Code`', 'inlineCode')}
        style={buttonStyle('inlineCode')}
      >
        Inline Code
      </button>
      <button
        onClick={() => handleButtonClick('```javascript\n// Code Block\n```', 'codeBlock')}
        style={buttonStyle('codeBlock')}
      >
        Code Block
      </button>
      <button
        onClick={() => handleButtonClick('[Link](https://example.com)', 'link')}
        style={buttonStyle('link')}
      >
        Link
      </button>
      <button
        onClick={() => handleButtonClick('![Image](https://via.placeholder.com/150)', 'image')}
        style={buttonStyle('image')}
      >
        Image
      </button>
      <button
        onClick={() => handleButtonClick('| Header | Header |\n| ------ | ------ |\n| Cell   | Cell   |', 'table')}
        style={buttonStyle('table')}
      >
        Table
      </button>
      <button
        onClick={() => handleButtonClick('---', 'horizontalRule')}
        style={buttonStyle('horizontalRule')}
      >
        Horizontal Rule
      </button>
      <button
        onClick={() => handleButtonClick('```jsx\n<MyComponent />\n```', 'jsx')}
        style={buttonStyle('jsx')}
      >
        JSX
      </button>
      <button
        onClick={() => handleButtonClick('---\ntitle: My Post\nauthor: Admin\n---', 'frontmatter')}
        style={buttonStyle('frontmatter')}
      >
        Frontmatter
      </button>
    </div>
  );
};

// Main editor component
const MDXEditorComponent = () => {
  const editorRef = useRef(null);

  const handleLogContent = () => {
    if (editorRef.current) {
      const markdown = editorRef.current.getMarkdown();
      console.log("Markdown Content:", markdown);
    }
  };

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: "4px", maxWidth: "500px", margin: "0 auto", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
      <CustomToolbar editorRef={editorRef} />
      <MDXEditor
        ref={editorRef}
        markdown="# Start typing..."
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          tablePlugin(),
          imagePlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          codeBlockPlugin(),
          codeMirrorPlugin(),
          frontmatterPlugin(),
          diffSourcePlugin(),
          thematicBreakPlugin(),
          toolbarPlugin(),
        ]}
      />
      <div style={{ padding: "10px", textAlign: "center" }}>
        <button
          onClick={handleLogContent}
          style={{ padding: "8px 16px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          Log Content
        </button>
      </div>
    </div>
  );
};
//mera code
export default MDXEditorComponent;