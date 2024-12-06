import React, { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
const RichTextEditor = ({ sendValue, onChange }) => {
  const [value, setValue] = useState(sendValue);

  const handleChange = (content, delta, source, editor) => {
    setValue(content);
    if (onChange) {
      onChange(content);
    }
  };

  const handleBlur = () => {
    if (sendValue) {
      sendValue(value);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
      ["code-block"],
    ],
  };

  return (
    <div>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Write something amazing..."
        modules={modules}
      />
    </div>
  );
};

export default RichTextEditor;
