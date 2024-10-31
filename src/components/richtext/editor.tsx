import React, { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import styles from "./RichTextEditor.css";

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
        placeholder="Write something amazing..."
        modules={modules}
        className={styles.editor}
      />
    </div>
  );
};

export default RichTextEditor;
