// app/components/admin/TiptapEditor.js
'use client';

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import Image from "@tiptap/extension-image";
import React, { useState } from "react";
import htmlToMd from "html-to-md";

// Toolbar component for UI buttons
const Toolbar = ({ editor }) => {
  if (!editor) return null;

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
        onClick={() => editor.chain().focus().toggleBold().run()}
        style={{
          padding: "5px 10px",
          background: editor.isActive("bold") ? "#d3d3d3" : "#fff",
          border: "1px solid #ccc",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        style={{
          padding: "5px 10px",
          background: editor.isActive("italic") ? "#d3d3d3" : "#fff",
          border: "1px solid #ccc",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        style={{
          padding: "5px 10px",
          background: editor.isActive("heading", { level: 1 }) ? "#d3d3d3" : "#fff",
          border: "1px solid #ccc",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        style={{
          padding: "5px 10px",
          background: editor.isActive("heading", { level: 2 }) ? "#d3d3d3" : "#fff",
          border: "1px solid #ccc",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        style={{
          padding: "5px 10px",
          background: editor.isActive("heading", { level: 3 }) ? "#d3d3d3" : "#fff",
          border: "1px solid #ccc",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        H3
      </button>
      <button
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()}
        style={{
          padding: "5px 10px",
          background: editor.isActive("table") ? "#d3d3d3" : "#fff",
          border: "1px solid #ccc",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Table
      </button>
      <button
        onClick={() => {
          const url = prompt("Enter image URL:");
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }}
        style={{
          padding: "5px 10px",
          background: "#fff",
          border: "1px solid #ccc",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Image
      </button>
    </div>
  );
};

// Main editor component
const TiptapEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      Image.configure({
        inline: true, // Allows images to be inline with text
        HTMLAttributes: {
          class: "custom-image", // Optional: Add a class for styling
        },
      }),
    ],
    content: "<p>Start typing...</p>",
  });

  const handleLogContent = () => {
    if (editor) {
      const html = editor.getHTML();
      const markdown = htmlToMd(html);
      console.log("Markdown Content:", markdown);
    }
  };

  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: "4px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      maxWidth: "800px",
      margin: "0 auto",
    }}>
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        style={{
          padding: "20px",
          minHeight: "300px",
          fontFamily: "Arial, sans-serif",
          fontSize: "16px",
        }}
      />
      <div style={{ padding: "10px", textAlign: "center" }}>
        <button
          onClick={handleLogContent}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Log Content
        </button>
      </div>
    </div>
  );
};

export default TiptapEditor;