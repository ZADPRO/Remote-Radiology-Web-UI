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
  width = 500,
  height = 620,
  onClose,
  defaultX = 20,
  defaultY = 20,
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
        setPosition({
          x: e.clientX - offset.x,
          y: e.clientY - offset.y,
        });
      }
      if (resizing) {
        setSize({
          width: Math.max(200, e.clientX - position.x),
          height: Math.max(200, e.clientY - position.y),
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
