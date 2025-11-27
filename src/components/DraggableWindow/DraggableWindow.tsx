import { Scaling, X } from "lucide-react";
import { useState, ReactNode, MouseEvent, useEffect } from "react";

interface Props {
  children: ReactNode;
  width?: number;
  height?: number;
  onClose?: () => void;
  defaultX?: number;
  defaultY?: number;
}

export default function DraggableWindow({
  children,
  width = 400,
  height = 550,
  onClose,
  defaultX = 10,
  defaultY = 10,
}: Props) {
  const [position, setPosition] = useState({ x: defaultX, y: defaultY });
  const [size, setSize] = useState({ width, height });

  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const startDrag = (e: MouseEvent<HTMLDivElement>) => {
    setDragging(true);
    setOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const startResize = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setResizing(true);
  };

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (dragging) {
        const newX = e.clientX - offset.x;
        const newY = e.clientY - offset.y;

        // ✅ Keep inside screen
        const maxX = window.innerWidth - size.width;
        const maxY = window.innerHeight - size.height;

        setPosition({
          x: Math.min(Math.max(0, newX), maxX),
          y: Math.min(Math.max(0, newY), maxY),
        });
      }
      if (resizing) {
        const newWidth = Math.max(200, e.clientX - position.x);
        const newHeight = Math.max(200, e.clientY - position.y);

        // ✅ Also prevent resizing outside screen
        const maxWidth = window.innerWidth - position.x;
        const maxHeight = window.innerHeight - position.y;

        setSize({
          width: Math.min(newWidth, maxWidth),
          height: Math.min(newHeight, maxHeight),
        });
      }
    };

    const stop = () => {
      setDragging(false);
      setResizing(false);
    };

    window.addEventListener("mousemove", move as any);
    window.addEventListener("mouseup", stop);

    return () => {
      window.removeEventListener("mousemove", move as any);
      window.removeEventListener("mouseup", stop);
    };
  }, [dragging, resizing, offset, position]);

  return (
    <div
      className="fixed z-50 border border-gray-400 shadow-lg bg-white rounded select-none"
      style={{
        top: position.y,
        left: position.x,
        width: size.width,
        height: size.height,
      }}
    >
      {/* HEADER - DRAG HERE ONLY */}
      <div
        onMouseDown={startDrag}
        className="cursor-move bg-[#1C293A] h-10 text-white px-3 py-2 rounded-t flex items-center relative"
      >
        {/* <span className="pointer-events-none select-none">Window</span> */}

        {onClose && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent drag on close click
              onClose();
            }}
            className="absolute top-1.5 right-1.5 p-1 rounded hover:bg-red-600"
          >
            <X size={18} color="white" />
          </button>
        )}
      </div>

      {/* CONTENT AREA — PDF WORKS FULLY HERE */}
      <div className="relative h-[calc(100%-40px)] overflow-auto p-2 pointer-events-auto">
        {children}
      </div>

      {/* RESIZE HANDLE */}
      <div
        onMouseDown={startResize}
        className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize flex items-center justify-center"
      >
        <Scaling width={14} height={14} color="#1C293A" />
      </div>
    </div>
  );
}
