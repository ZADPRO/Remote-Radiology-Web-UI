import { Quill } from "react-quill-new";
import type QuillType from "quill";

// Custom Image Resize Module
class ImageResize {
  quill: QuillType;
  options: any;
  img: HTMLImageElement | null = null;
  overlay: HTMLElement | null = null;
  boxes: HTMLElement[] = [];
  isDragging = false;
  startX = 0;
  startY = 0;
  startWidth = 0;
  startHeight = 0;

  static DEFAULTS = {
    modules: ["Resize", "DisplaySize"],
    handleStyles: {
      position: "absolute",
      height: "12px",
      width: "12px",
      backgroundColor: "white",
      border: "1px solid #777",
      boxSizing: "border-box",
      cursor: "se-resize",
    },
    displayStyles: {
      position: "absolute",
      font: "12px/1.0 Arial, Helvetica, sans-serif",
      padding: "4px 8px",
      textAlign: "center",
      color: "white",
      backgroundColor: "black",
      borderRadius: "3px",
    },
  };

  constructor(quill: QuillType, options = {}) {
    this.quill = quill;
    this.options = Object.assign({}, ImageResize.DEFAULTS, options);

    // Bind event handlers
    this.handleClick = this.handleClick.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);

    // Listen for image clicks
    this.quill.root.addEventListener("click", this.handleClick, false);
    document.addEventListener("mousedown", this.handleMouseDown, false);
    document.addEventListener("mousemove", this.handleMouseMove, false);
    document.addEventListener("mouseup", this.handleMouseUp, false);
  }

  handleClick(evt: MouseEvent) {
    const target = evt.target as HTMLElement;
    if (target && target.tagName && target.tagName.toUpperCase() === "IMG") {
      if (this.img === target) {
        return;
      }
      if (this.img) {
        this.hide();
      }
      this.show(target as HTMLImageElement);
    } else if (this.img) {
      this.hide();
    }
  }

  show(img: HTMLImageElement) {
    this.img = img;
    this.showOverlay();
  }

  showOverlay() {
    if (!this.img) return;

    const imgRect = this.img.getBoundingClientRect();
    const containerRect = this.quill.root.getBoundingClientRect();

    // Create overlay
    this.overlay = document.createElement("div");
    Object.assign(this.overlay.style, {
      position: "absolute",
      boxSizing: "border-box",
      border: "1px dashed #444",
      left: `${imgRect.left - containerRect.left - 1}px`,
      top: `${imgRect.top - containerRect.top - 1}px`,
      width: `${imgRect.width + 2}px`,
      height: `${imgRect.height + 2}px`,
    });

    // Create resize handle
    const box = document.createElement("div");
    Object.assign(box.style, this.options.handleStyles, {
      right: "-6px",
      bottom: "-6px",
    });
    this.overlay.appendChild(box);
    this.boxes.push(box);

    // Create size display
    const display = document.createElement("div");
    Object.assign(display.style, this.options.displayStyles, {
      left: "4px",
      top: "-20px",
    });
    display.textContent = `${Math.round(imgRect.width)}px × ${Math.round(
      imgRect.height
    )}px`;
    this.overlay.appendChild(display);

    this.quill.root.parentNode?.appendChild(this.overlay);
  }

  hide() {
    this.hideOverlay();
    this.img = null;
  }

  hideOverlay() {
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
    this.boxes = [];
  }

  handleMouseDown(evt: MouseEvent) {
    if (!this.img || !this.overlay) return;

    const target = evt.target as HTMLElement;
    if (this.boxes.includes(target)) {
      this.isDragging = true;
      this.startX = evt.clientX;
      this.startY = evt.clientY;
      this.startWidth = parseInt(
        document.defaultView?.getComputedStyle(this.img).width || "0",
        10
      );
      this.startHeight = parseInt(
        document.defaultView?.getComputedStyle(this.img).height || "0",
        10
      );
      evt.preventDefault();
    }
  }

  handleMouseMove(evt: MouseEvent) {
    if (!this.isDragging || !this.img || !this.overlay) return;

    const deltaX = evt.clientX - this.startX;
    const deltaY = evt.clientY - this.startY;
    const newWidth = this.startWidth + deltaX;
    const newHeight = this.startHeight + deltaY;

    if (newWidth > 10 && newHeight > 10) {
      this.img.style.width = `${newWidth}px`;
      this.img.style.height = `${newHeight}px`;

      // Update overlay
      const imgRect = this.img.getBoundingClientRect();
      const containerRect = this.quill.root.getBoundingClientRect();

      Object.assign(this.overlay.style, {
        left: `${imgRect.left - containerRect.left - 1}px`,
        top: `${imgRect.top - containerRect.top - 1}px`,
        width: `${imgRect.width + 2}px`,
        height: `${imgRect.height + 2}px`,
      });

      // Update size display
      const display = this.overlay.querySelector(
        "div:last-child"
      ) as HTMLElement;
      if (display) {
        display.textContent = `${Math.round(newWidth)}px × ${Math.round(
          newHeight
        )}px`;
      }
    }
  }

  handleMouseUp() {
    if (this.isDragging) {
      this.isDragging = false;
    }
  }
}

// Register the custom ImageResize module
Quill.register("modules/imageResize", ImageResize);

// Custom Undo button icon component for Quill editor. You can import it directly
// from 'quill/assets/icons/undo.svg' but I found that a number of loaders do not
// handle them correctly
const CustomUndo = () => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
    <path
      className="ql-stroke"
      d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"
    />
  </svg>
);

// Redo button icon component for Quill editor
const CustomRedo = () => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
    <path
      className="ql-stroke"
      d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"
    />
  </svg>
);

// Undo and redo functions for Custom Toolbar
function undoChange(this: { quill: QuillType }) {
  this.quill.history.undo();
}

function redoChange(this: { quill: QuillType }) {
  this.quill.history.redo();
}

// Add sizes to whitelist and register them
const Size: any = Quill.import("formats/size");
Size.whitelist = ["extra-small", "small", "medium", "large"];
Quill.register(Size, true);

// Add fonts to whitelist and register them
const Font: any = Quill.import("formats/font");
Font.whitelist = [
  "arial",
  "comic-sans",
  "courier-new",
  "georgia",
  "helvetica",
  "lucida",
];
Quill.register(Font, true);

// Modules object for setting up the Quill editor
export const createModules = (toolbarId: string) => ({
  toolbar: {
    container: `#${toolbarId}`,
    handlers: {
      undo: undoChange,
      redo: redoChange,
    },
  },
  history: {
    delay: 3000,
    maxStack: 100,
    userOnly: true,
  },
  imageResize: {
    modules: ["Resize", "DisplaySize"],
  },
});

// Formats objects for setting up the Quill editor
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
  "bullet",
  "indent",
  "link",
  "image",
  "color",
  "code-block",
  "table",
  "width", // Add width format for image resizing
  "height", // Add height format for image resizing
  "style", // Add style format for image resizing
];

// Quill Toolbar component
export const QuillToolbar = ({ id }: { id: string }) => (
  <div id={id}>
    <span className="ql-formats">
      {/* <select className="ql-font" defaultValue="arial">
        <option value="arial">Arial</option>
        <option value="comic-sans">Comic Sans</option>
        <option value="courier-new">Courier New</option>
        <option value="georgia">Georgia</option>
        <option value="helvetica">Helvetica</option>
        <option value="lucida">Lucida</option>
      </select> */}
      {/* <select className="ql-size" defaultValue="small">
        <option value="large">Heading 1</option>
        <option value="medium">Heading 2</option>
        <option value="small">Heading 3</option>
        <option value="extra-small">Normal</option>
      </select> */}
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
      {/* <button className="ql-strike" /> */}
    </span>
    <span className="ql-formats">
      <button className="ql-list" value="ordered" />
      <button className="ql-list" value="bullet" />
      <button className="ql-indent" value="-1" />
      <button className="ql-indent" value="+1" />
    </span>
    {/* <span className="ql-formats">
      <button className="ql-script" value="super" />
      <button className="ql-script" value="sub" />
      <button className="ql-blockquote" />
      <button className="ql-direction" />
    </span> */}
    <span className="ql-formats">
      <select className="ql-align" />
      <select className="ql-color" />
      <select className="ql-background" />
    </span>
    <span className="ql-formats">
      {/* <button className="ql-link" /> */}
      <button className="ql-image" />
      {/* <button className="ql-video" /> */}
    </span>
    {/* <span className="ql-formats">
      <button className="ql-formula" />
      <button className="ql-code-block" />
      <button className="ql-clean" />
    </span> */}
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
