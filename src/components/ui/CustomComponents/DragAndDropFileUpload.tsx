import React, { useRef, useState } from "react";
import { Button } from "../button";

// You may replace React.ComponentType with your actual Upload SVG/icon type
interface DragAndDropUploadBoxProps {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  buttonLabel?: string;
  side: string; // Replace with: side: Side; if you have a Side type
  onFilesSelected: (files: FileList, side: string) => void; // Replace string with Side
  accept?: string;
  multiple?: boolean;
  fileInputRef?: React.RefObject<HTMLInputElement>;
}

const DragAndDropUploadBox: React.FC<DragAndDropUploadBoxProps> = ({
  icon: Icon,
  buttonLabel = "Browse File",
  side,
  onFilesSelected,
  accept,
  multiple = true,
  fileInputRef,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = fileInputRef || useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      onFilesSelected(e.dataTransfer.files, side);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      onFilesSelected(e.target.files, side);
    }
    // Clear the input value to allow re-selecting the same file
    e.target.value = "";
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      className={`border-dashed border-2 border-gray-300 rounded-lg p-4 sm:p-6 text-center shadow-sm transition-colors ${
        isDragActive ? "bg-green-50 border-green-500" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Icon className="mx-auto text-gray-500" size={28} />
      <p className="text-xs sm:text-sm text-gray-700 mt-2">
        Choose a file or drag & drop it here
      </p>
      <Button
        type="button"
        className="mt-3 sm:mt-4 bg-[#ABB4A5] hover:bg-[#8e9787] text-sm px-4 py-2"
        onClick={handleButtonClick}
      >
        {buttonLabel}
      </Button>
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default DragAndDropUploadBox;