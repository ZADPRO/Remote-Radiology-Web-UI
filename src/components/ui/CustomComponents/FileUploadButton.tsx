import React from "react";

interface FileUploadButtonProps {
  id: string;
  label?: string;
  accept?: string;
  required?: boolean;
  multiple?: boolean;
  isFilePresent: boolean;
  maxSize?: number; // optional max size in bytes
  onValidFile?: (file: File) => void; // optional callback if file is valid
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // fallback if you want full access
  setError?: (msg: string | null) => void;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  id,
  label = "Upload File",
  accept = ".pdf, .jpeg, .jpg, .png",
  required = false,
  multiple = false,
  isFilePresent,
  maxSize,
  onValidFile,
  onChange,
  setError,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File size validation
    if (maxSize && file.size > maxSize) {
      setError?.(`File must be less than ${Math.round(maxSize / (1024 * 1024))}MB.`);
      return;
    }

    setError?.(null);
    onValidFile?.(file);
    onChange?.(e);
  };

  return (
    <label
      htmlFor={id}
      className="cursor-pointer border px-3 py-1 rounded-lg bg-white hover:bg-gray-100 relative"
    >
      <input
        id={id}
        type="file"
        multiple={multiple}
        className="sr-only"
        accept={accept}
        required={required && !isFilePresent}
        onChange={handleChange}
        value=""
      />
      {label}
    </label>
  );
};

export default FileUploadButton;
