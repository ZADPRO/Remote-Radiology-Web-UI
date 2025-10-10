import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry";
 
interface PDFPreviewerProps {
    blob: Blob | null;
}
 
const PDFPreviewer: React.FC<PDFPreviewerProps> = ({ blob }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [pageCount, setPageCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
    const [zoom, setZoom] = useState<number>(1.5);
 
    // 🔒 Prevent right click, save, print, and developer tools
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => e.preventDefault();
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && ["p", "s", "u"].includes(e.key.toLowerCase())) {
                e.preventDefault();
                alert("This action is disabled.");
            }
            // Prevent developer tools (Ctrl+Shift+I)
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") {
                e.preventDefault();
                alert("Developer tools are disabled.");
            }
        };
 
        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("keydown", handleKeyDown);
 
        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
 
    // 📄 Load PDF
    useEffect(() => {
        const loadPDF = async () => {
            if (!blob) return;
            const loadingTask = pdfjsLib.getDocument({ data: await blob.arrayBuffer() });
            const pdf = await loadingTask.promise;
            setPdfDoc(pdf);
            setPageCount(pdf.numPages);
            setCurrentPage(1);
        };
 
        loadPDF();
    }, [blob]);
 
    // 🖼 Render current page with zoom
    useEffect(() => {
        const renderPage = async () => {
            if (!pdfDoc || !canvasRef.current) return;
 
            const page = await pdfDoc.getPage(currentPage);
            const viewport = page.getViewport({ scale: zoom });
 
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");
            if (!context) return;
 
            // Use devicePixelRatio for high-quality rendering
            const outputScale = window.devicePixelRatio || 1;
 
            canvas.width = Math.floor(viewport.width * outputScale);
            canvas.height = Math.floor(viewport.height * outputScale);
            canvas.style.width = `${viewport.width}px`;
            canvas.style.height = `${viewport.height}px`;
 
            const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined;
 
            const renderContext = {
                canvasContext: context,
                transform,
                viewport,
            };
 
            await page.render(renderContext).promise;
        };
 
        renderPage();
    }, [pdfDoc, currentPage, zoom]);
 
    // ⚫ Black out canvas on tab hidden, window blur, or mouse leave
    useEffect(() => {
        const blackOutCanvas = () => {
            if (canvasRef.current) {
                canvasRef.current.style.filter = "brightness(0%)";
            }
        };
 
        const restoreCanvas = () => {
            if (canvasRef.current) {
                canvasRef.current.style.filter = "";
            }
        };
 
        const onVisibilityChange = () => {
            if (document.hidden) blackOutCanvas();
            else restoreCanvas();
        };
 
        const onBlur = () => blackOutCanvas();
        const onFocus = () => restoreCanvas();
 
        // Add mouse leave/enter for extra protection (e.g., during screenshot tool use)
        const onMouseLeave = () => blackOutCanvas();
        const onMouseEnter = () => restoreCanvas();
 
        document.addEventListener("visibilitychange", onVisibilityChange);
        window.addEventListener("blur", onBlur);
        window.addEventListener("focus", onFocus);
        document.addEventListener("mouseleave", onMouseLeave);
        document.addEventListener("mouseenter", onMouseEnter);
 
        return () => {
            document.removeEventListener("visibilitychange", onVisibilityChange);
            window.removeEventListener("blur", onBlur);
            window.removeEventListener("focus", onFocus);
            document.removeEventListener("mouseleave", onMouseLeave);
            document.removeEventListener("mouseenter", onMouseEnter);
        };
    }, []);
 
    const handlePrev = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };
 
    const handleNext = () => {
        setCurrentPage((prev) => Math.min(prev + 1, pageCount));
    };
 
    const handleZoomIn = () => {
        setZoom((prev) => Math.min(prev + 0.2, 3)); // Max zoom 3x
    };
 
    const handleZoomOut = () => {
        setZoom((prev) => Math.max(prev - 0.2, 0.5)); // Min zoom 0.5x
    };
 
    if (!blob) return <div className="text-center py-10">Loading PDF...</div>;
 
    return (
        <div className="w-full h-[90vh]">
            <div className="flex h-[5vh] flex-wrap items-center gap-3 mb-4 justify-center">
                <button
                    onClick={handlePrev}
                    disabled={currentPage <= 1}
                    className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
                >
                    Previous
                </button>
 
                <button
                    onClick={handleZoomOut}
                    disabled={zoom <= 0.5}
                    className="bg-[#a3b1a0] text-[#fff] px-3 py-1 rounded disabled:opacity-50"
                >
                    Zoom Out
                </button>
 
                <span className="text-sm font-medium">
                    Page {currentPage} of {pageCount} | Zoom: {(zoom * 100).toFixed(0)}%
                </span>
 
                <button
                    onClick={handleZoomIn}
                    disabled={zoom >= 3}
                    className="bg-[#a3b1a0] text-[#fff] px-3 py-1 rounded disabled:opacity-50"
                >
                    Zoom In
                </button>
 
                <button
                    onClick={handleNext}
                    disabled={currentPage >= pageCount}
                    className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
            <div
                ref={containerRef}
                className="w-full h-[75vh] rounded-sm flex flex-col items-center overflow-auto p-4 bg-[#fff]"
            >
                <canvas ref={canvasRef} className="border shadow-xl max-w-full h-auto" />
            </div>
        </div>
    );
};
 
export default PDFPreviewer;