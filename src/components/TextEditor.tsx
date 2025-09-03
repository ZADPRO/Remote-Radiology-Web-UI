import React, { useEffect, useId, useRef } from "react";
import ReactQuill from "react-quill-new"; // or 'react-quill'
import "react-quill-new/dist/quill.snow.css";
// import TableUI from "quill-table-ui";
// import "quill-table-ui/dist/index.css";
import QuillToolbar, { createModules, formats } from "./QuillToolbar";

interface TextEditorProps {
  value: string;
  onChange?: (
    content: string,
    delta: any,
    source: "user" | "api" | "silent",
    editor: any
  ) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  onManualEdit?: () => void;
  height?: string;
}

// Register the table UI module
// Quill.register("modules/tableUI", TableUI);

// const modules = {
//   toolbar: [
//     [{ header: [1, 2, 3, false] }],
//     ["bold", "italic", "underline"],
//     [{ list: "ordered" }, { list: "bullet" }],
//     [{ 'indent': '-1'}, { 'indent': '+1' }],
//     ["blockquote", "code-block"],
//     [{ align: [] }],
//     [{ color: [] }, { background: [] }],
//     ["link", "image"],
//     ["clean"],
//     // ["table"], // Add the table button here
//   ],
//   tableUI: true, // enable table UI module
// };

// const formats = [
//   "header",
//   "bold",
//   "italic",
//   "underline",
//   "list",
//   'indent',
//   "blockquote",
//   "code-block",
//   "align",
//   "color",
//   "background",
//   "link",
//   "image",
//   "table",
// ];

const TextEditor: React.FC<TextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing...",
  className = "",
  readOnly,
  onManualEdit,
  height,
}) => {
  const quillRef = useRef<ReactQuill | null>(null);
  const toolbarId = useId();

  useEffect(() => {
    console.log("$$$$$$$$$$$$$$$$$$$$",value)
    const editor = quillRef.current?.getEditor();
    if (!editor) return;

    const handleTextChange = (_delta: any, _oldDelta: any, source: string) => {
      if (source === "user") {
        onManualEdit?.(); // trigger sync breaker
      }
      // console.log(delta, oldDelta, source)
    };

    editor.on("text-change", handleTextChange);
    return () => {
      editor.off("text-change", handleTextChange);
    };
  }, [onManualEdit]);

  // const [mic, setMic] = useState(false);

  return (
    <div>
      {/* {mic ? (
        <button
          onClick={() => {
            setMic(false);
          }}
        >
          OFF
        </button>
      ) : (
        <button
          onClick={() => {
            setMic(true);
          }}
        >
          ON
        </button>
      )} */}
      <div
        className={`border rounded-xl bg-background p-4 shadow-sm ${className} ${
          readOnly ? "cursor-not-allowed" : ""
        }`}
      >
        <style>{`
        .ql-container {
          height: ${height ? height : "auto"};
        }
      `}</style>
        <QuillToolbar id={toolbarId} />
        <ReactQuill
          ref={quillRef}
          value={value}
          onChange={onChange}
          modules={createModules(toolbarId)}
          formats={formats}
          theme="snow"
          placeholder={placeholder}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
};

export default TextEditor;
