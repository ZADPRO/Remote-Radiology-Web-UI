import { Quill } from "react-quill-new"; // ✅ use same source as ReactQuill
import type QuillType from "quill";
import ImageResize from "quill-image-resize-module-react";

// Custom Undo button icon component
const CustomUndo = () => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
    <path
      className="ql-stroke"
      d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"
    />
  </svg>
);

// Custom Redo button icon component
const CustomRedo = () => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
    <path
      className="ql-stroke"
      d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"
    />
  </svg>
);

// Undo and redo functions
function undoChange(this: { quill: QuillType }) {
  this.quill.history.undo();
}
function redoChange(this: { quill: QuillType }) {
  this.quill.history.redo();
}

// Register custom sizes
const Size: any = Quill.import("formats/size");
Size.whitelist = ["extra-small", "small", "medium", "large"];
Quill.register(Size, true);

// Register custom fonts
const Font: any = Quill.import("formats/font");
Font.whitelist = ["arial", "comic-sans", "courier-new", "georgia", "helvetica", "lucida"];
Quill.register(Font, true);

// ✅ Register ImageResize safely (avoid duplicate registration)
if (typeof window !== "undefined" && Quill && !Quill.imports["modules/imageResize"]) {
  Quill.register("modules/imageResize", ImageResize);
}

// Modules config
export const createModules = (toolbarId: string) => ({
  toolbar: {
    container: `#${toolbarId}`,
    handlers: {
      undo: undoChange,
      redo: redoChange,
    },
  },
  imageResize: {
    parchment: Quill.import("parchment"),
    modules: ["Resize", "DisplaySize", "Toolbar"],
  },
  history: {
    delay: 3000,
    maxStack: 100,
    userOnly: true,
  },
});

// Formats
export const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "align",
  "strike",
  "script",
  "blockquote",
  "background",
  "list",
  "indent",
  "link",
  "image",
  "color",
  "code-block",
  "table",
];

// Toolbar Component
export const QuillToolbar = ({ id }: { id: string }) => (
  <div id={id}>
    <span className="ql-formats">
      <select className="ql-header" defaultValue="4">
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
        <option value="4">Normal</option>
      </select>
    </span>
    <span className="ql-formats">
      <button className="ql-bold" />
      <button className="ql-italic" />
      <button className="ql-underline" />
    </span>
    <span className="ql-formats">
      <button className="ql-list" value="ordered" />
      <button className="ql-list" value="bullet" />
      <button className="ql-indent" value="-1" />
      <button className="ql-indent" value="+1" />
    </span>
    <span className="ql-formats">
      <select className="ql-align" />
      <select className="ql-color" />
      <select className="ql-background" />
    </span>
    <span className="ql-formats">
      <button className="ql-image" />
    </span>
    <span className="ql-formats">
      <button className="ql-undo">
        <CustomUndo />
      </button>
      <button className="ql-redo">
        <CustomRedo />
      </button>
    </span>
  </div>
);

export default QuillToolbar;
