import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";
import { TDocumentDefinitions } from "pdfmake/interfaces";

// Set up fonts
pdfMake.vfs = pdfFonts.vfs;

/**
 * Adds controlled spacing CSS styles to HTML content
 * @param htmlContent - The HTML content string.
 * @returns The styled HTML content string.
 */
function addControlledSpacingStyles(htmlContent: string): string {
  const controlledStyles = `
    <style>
      body { 
        font-family: Arial, sans-serif !important;
        font-size: 10px !important;
        line-height: 1.2 !important;
      }
      p { 
        margin: 3px 0 !important; 
        padding: 0 !important;
      }
      div { 
        margin: 2px 0 !important; 
        padding: 0 !important;
      }
      h1, h2, h3, h4, h5, h6 { 
        margin: 4px 0 2px 0 !important; 
        padding: 0 !important;
        font-weight: bold !important;
      }
      h1 { font-size: 16px !important; margin: 6px 0 3px 0 !important; }
      h2 { font-size: 14px !important; margin: 5px 0 2px 0 !important; }
      h3 { font-size: 12px !important; margin: 4px 0 2px 0 !important; }
      br { 
        display: block !important;
        margin: 1px 0 !important;
        content: "" !important;
      }
      table { 
        border-collapse: collapse !important;
        margin: 4px 0 !important;
        width: 100% !important;
        max-width: 100% !important;
      }
      td, th { 
        padding: 2px 4px !important;
        border: 1px solid #000 !important;
        font-size: 9px !important;
        vertical-align: top !important;
      }
      th {
        font-weight: bold !important;
        background-color: #f0f0f0 !important;
      }
      ul, ol { 
        margin: 3px 0 !important; 
        padding-left: 20px !important;
      }
      li { 
        margin: 1px 0 !important; 
        padding: 0 !important;
      }
      strong, b {
        font-weight: bold !important;
      }
    </style>
  `;

  return controlledStyles + htmlContent;
}

/**
 * Processes the converted pdfMake content to maintain proper spacing and force full table width.
 * This function handles content recursively.
 * @param content - The pdfMake content object or array.
 * @returns The processed pdfMake content object or array.
 */
function processContentSpacing(content: any): any {
  if (Array.isArray(content)) {
    return content.map((item) => processContentSpacing(item));
  }

  if (typeof content === "object" && content !== null) {
    // Log every node for debugging
    console.log(content);

    // Table: force full width
    if (content.table && content.table.body) {
      const colCount = content.table.body[0]?.length || 0;
      if (colCount > 0) content.table.widths = Array(colCount).fill("*");
    }

    // Preserve text margins
    if (content.text !== undefined) content.margin = content.margin || [0, 0, 0, 0];

    // IMAGE HANDLING
    // if (content.image) {
    //   const maxWidth = 500; // maximum width in PDF points
    //   if (!content.width || content.width > maxWidth) {
    //     content.width = maxWidth;
    //   }
    //   // Fit image proportionally
    //   content.fit = [maxWidth, 500];
    //   console.log("Processed image:", {
    //     src: content.image,
    //     width: content.width,
    //     fit: content.fit,
    //   });
    // }
    if (content.image) {
      // If no width specified or width > 500, set width = 500
      if (!content.width || content.width > 500) {
        content.width = 500;
      }
      // Optional: maintain aspect ratio by not setting height
    }

    // Sometimes images are inside a 'stack' array (common for html-to-pdfmake)
    if (content.stack && Array.isArray(content.stack)) {
      content.stack = content.stack.map((item: any) => processContentSpacing(item));
    }

    // Recursive handling for 'content' arrays (nested divs, paragraphs, etc.)
    if (content.content) {
      content.content = processContentSpacing(content.content);
    }

    // Recursive handling for table body
    if (content.table && content.table.body) {
      content.table.body = processContentSpacing(content.table.body);
    }
  }

  return content;
}


/**
 * Generates and downloads a PDF from an HTML string with correct table sizing.
 * @param htmlString - The HTML content to convert.
 * @param baseFileName - The base name for the downloaded PDF file.
 */
export function downloadReportsPdf(
  htmlString: string,
  baseFileName = "Medical_Report"
): void {
  try {
    // Step 1: Add controlled spacing styles (preserving br tags)
    const styledHtml: string = addControlledSpacingStyles(htmlString);

    // Step 2: Convert HTML to pdfMake format
    const converted: any = htmlToPdfmake(styledHtml, {
      tableAutoSize: true,
      defaultStyles: {
        p: { margin: [0, 0, 0, 0] as [number, number, number, number] },
        div: { margin: [0, 0, 0, 0] as [number, number, number, number] },
        h1: { margin: [0, 0, 0, 0] as [number, number, number, number] },
        h2: { margin: [0, 0, 0, 0] as [number, number, number, number] },
        h3: { margin: [0, 0, 0, 0] as [number, number, number, number] },
      },
    });

    // Step 3: Process content for proper spacing and force full-width tables
    const processedContent: any = processContentSpacing(converted);

    // Step 4: Create document definition with proper TypeScript types
    const documentDefinition: TDocumentDefinitions = {
      content: Array.isArray(processedContent)
        ? processedContent
        : [processedContent],
      defaultStyle: {
        fontSize: 10,
        lineHeight: 1.2, // Proper line height for readability
      },
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          margin: [0, 0, 0, 0] as [number, number, number, number],
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 0, 0, 0] as [number, number, number, number],
        },
        paragraph: {
          fontSize: 10,
          margin: [0, 0, 0, 0] as [number, number, number, number],
        },
        table: {
          margin: [0, 5, 0, 15] as [number, number, number, number],
        },
        tableHeader: {
          bold: true,
          fontSize: 9,
          color: "black",
          fillColor: "#f0f0f0",
        },
      },
      pageSize: "A4",
      pageOrientation: "portrait",
      pageMargins: [40, 30, 40, 30] as [number, number, number, number], // Proper margins
      info: {
        title: baseFileName,
        author: "Medical Imaging System",
        creator: "Medical Report Generator",
        creationDate: new Date(),
      },
    };

    // Step 5: Generate and download PDF
    const fileName = `${baseFileName}.pdf`;
    pdfMake.createPdf(documentDefinition).download(fileName);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error(
      `PDF generation failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
