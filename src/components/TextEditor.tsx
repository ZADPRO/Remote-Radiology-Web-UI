import React, { useEffect, useRef } from "react";
import ReactQuill, { Quill } from "react-quill-new"; // or 'react-quill'
import "react-quill-new/dist/quill.snow.css";
 
import TableUI from "quill-table-ui";
import "quill-table-ui/dist/index.css";
 
interface TextEditorProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  onManualEdit?: () => void;
}
 
// Register the table UI module
Quill.register("modules/tableUI", TableUI);
 
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    ["link", "image"],
    ["clean"],
    // ["table"], // Add the table button here
  ],
  tableUI: true, // enable table UI module
};
 
const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "list",
  "blockquote",
  "code-block",
  "align",
  "color",
  "background",
  "link",
  "image",
  "table",
];
 
const TextEditor: React.FC<TextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing...",
  className = "",
  readOnly,
  onManualEdit,
}) => {
  const quillRef = useRef<ReactQuill | null>(null);
 
  useEffect(() => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;
 
    const handleTextChange = (delta: any, oldDelta: any, source: string) => {
      if (source === "user") {
        onManualEdit?.(); // trigger sync breaker
      }
      console.log(delta, oldDelta, source)
    };
 
    editor.on("text-change", handleTextChange);
    return () => {
      editor.off("text-change", handleTextChange);
    };
  }, [onManualEdit]);
 
  return (
    <div
      className={`border rounded-xl bg-background p-4 shadow-sm ${className} ${
        readOnly ? "cursor-not-allowed" : ""
      }`}
    >
      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        theme="snow"
        placeholder={placeholder}
        readOnly={readOnly}
      />
    </div>
  );
};
 
export default TextEditor;