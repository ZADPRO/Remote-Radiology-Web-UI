import React from "react";

interface DownloadingOverlayProps {
  downloadedMB: number;
  percentage: number;
  currentFile: string;
}

const DownloadingOverlay: React.FC<DownloadingOverlayProps> = ({
  downloadedMB,
  percentage,
  currentFile,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
      <div className="text-lg font-semibold mb-2">
        Downloading DICOM Files...
      </div>
      <div className="text-sm mb-4 opacity-90">
        Currently downloading: <span className="font-semibold">{currentFile}</span>
      </div>
      <div className="text-2xl font-bold mb-4">
        {downloadedMB.toFixed(2)} MB
      </div>
      <div className="w-64 bg-white/20 rounded-full h-3 overflow-hidden">
        <div
          className="bg-green-400 h-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="mt-2 text-sm">{percentage.toFixed(1)}%</div>
    </div>
  );
};

export default DownloadingOverlay;
