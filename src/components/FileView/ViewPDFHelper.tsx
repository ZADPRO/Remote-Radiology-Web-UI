import React from "react";

export const ViewPDFHelper: React.FC<{ base64Data: string }> = ({ base64Data }) => {
  const [pdfUrl, setPdfUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });
    const blobUrl = URL.createObjectURL(blob);
    setPdfUrl(blobUrl);

    // Clean up object URL when component unmounts
    return () => URL.revokeObjectURL(blobUrl);
  }, [base64Data]);

  if (!pdfUrl) return <p className="text-center py-4">Loading PDF...</p>;

  return (
    <iframe
      src={pdfUrl}
      title="PDF Preview"
      className="w-full h-[80vh] border rounded-md"
    />
  );
};
