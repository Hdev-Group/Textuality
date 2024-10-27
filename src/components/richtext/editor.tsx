// src/components/RichTextEditor.js
import React, { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import styles from "./RichTextEditor.module.css"; // Import if using CSS module

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const RichTextEditor = () => {
  const [value, setValue] = useState("");

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
      ["code-block"],
    ],
  };

  return (
    <div>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        modules={modules}
        placeholder="Write something awesome..."
      />
      <style jsx global>{`
        .ql-toolbar {
          color: #fff !important;
        }
        .ql-editor {
          color: white !important;
          background-color: #fff !important;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
