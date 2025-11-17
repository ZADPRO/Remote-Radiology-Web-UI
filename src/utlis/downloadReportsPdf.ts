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

function normalizeTransparentCss(html: string): string {
  return (
    html
      .replace(
        /background-color\s*:\s*transparent\s*;?/gi,
        "background-color:#ffffff;"
      )
      .replace(/background\s*:\s*transparent\s*;?/gi, "background:#ffffff;")
      .replace(
        /background-color\s*:\s*rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*0(?:\.0+)?\s*\)\s*;?/gi,
        "background-color:#ffffff;"
      )
      .replace(
        /background\s*:\s*rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*0(?:\.0+)?\s*\)\s*;?/gi,
        "background:#ffffff;"
      )
      // Replace background-color: oklch(...);
      .replace(
        /background-color\s*:\s*(oklch|lab|lch|hwb)\([^)]*\)\s*;?/gi,
        "background-color:#ffffff;"
      )
      // Replace color: oklch(...);
      .replace(
        /color\s*:\s*(oklch|lab|lch|hwb)\([^)]*\)\s*;?/gi,
        "color:#000000;"
      )
      // Replace background: oklch(...);
      .replace(
        /background\s*:\s*(oklch|lab|lch|hwb)\([^)]*\)\s*;?/gi,
        "background:#ffffff;"
      )
  );
}

function forceWhiteForTransparent(node: any): any {
  if (Array.isArray(node)) return node.map(forceWhiteForTransparent);
  if (!node || typeof node !== "object") return node;

  const isTransparent = (val: any) =>
    val === "transparent" ||
    (typeof val === "string" &&
      /rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*0(\.0+)?\s*\)/i.test(val));

  if (isTransparent(node.background)) node.background = "#FFFFFF"; // text background
  if (isTransparent((node as any).fillColor))
    (node as any).fillColor = "#FFFFFF"; // table cell bg

  if (node.content) node.content = forceWhiteForTransparent(node.content);
  if (node.stack) node.stack = forceWhiteForTransparent(node.stack);
  if (node.columns) node.columns = forceWhiteForTransparent(node.columns);
  if (node.table && node.table.body)
    node.table.body = forceWhiteForTransparent(node.table.body);
  return node;
}

function applyRightAlignment(content: any): any {
  if (Array.isArray(content)) return content.map(applyRightAlignment);

  if (content && typeof content === "object") {
    if (content.text && content.alignment === undefined) {
      if (content.style && content.style.includes("ql-align-right")) {
        content.alignment = "right";
      }
    }

    if (content.content) content.content = applyRightAlignment(content.content);
    if (content.stack) content.stack = applyRightAlignment(content.stack);
    if (content.table && content.table.body)
      content.table.body = applyRightAlignment(content.table.body);
  }

  return content;
}

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

    // Table: force full width
    if (content.table && content.table.body) {
      const colCount = content.table.body[0]?.length || 0;
      if (colCount > 0) content.table.widths = Array(colCount).fill("*");
    }

    // Preserve text margins
    if (content.text !== undefined)
      content.margin = content.margin || [0, 0, 0, 0];

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
      content.stack = content.stack.map((item: any) =>
        processContentSpacing(item)
      );
    }

    if (content.ol && Array.isArray(content.ol)) {
      // Convert ordered list (ol) to unordered list (ul) with bullets
      content.ul = content.ol;
      delete content.ol;

      // Optional: force bullet style
      content.type = "disc"; // 'disc' | 'circle' | 'square'
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

function applySuperscript(content: any): any {
  if (Array.isArray(content)) {
    return content.map((item: any) => applySuperscript(item));
  }

  if (typeof content === "object" && content !== null) {
    // Handle nodes that have the 'sup' property or 'html-sup' style
    if (content.sup || (content.style && Array.isArray(content.style) && content.style.includes('html-sup'))) {
      // Recursively extract text from nested structures
      const extractText = (obj: any): string => {
        if (typeof obj === 'string') return obj;
        if (Array.isArray(obj)) {
          return obj.map(item => extractText(item)).join('');
        }
        if (obj && typeof obj === 'object' && obj.text) {
          return extractText(obj.text);
        }
        return '';
      };
      
      const textContent = extractText(content.text);
      
      return {
        text: textContent,
        fontSize: 6,
        // Use a positive vertical offset for superscript (moves text UP)
        characterSpacing: 0,
        sup: {
          offset: '30%',
          fontSize: 6
        }
      };
    }

    // Handle subscripts similarly
    if (content.sub || (content.style && Array.isArray(content.style) && content.style.includes('html-sub'))) {
      const extractText = (obj: any): string => {
        if (typeof obj === 'string') return obj;
        if (Array.isArray(obj)) {
          return obj.map(item => extractText(item)).join('');
        }
        if (obj && typeof obj === 'object' && obj.text) {
          return extractText(obj.text);
        }
        return '';
      };
      
      const textContent = extractText(content.text);
      
      return {
        text: textContent,
        fontSize: 6,
        sub: {
          offset: '30%',
          fontSize: 6
        }
      };
    }

    // Handle text arrays (inline elements)
    if (Array.isArray(content.text)) {
      content.text = content.text.map((item: any) => applySuperscript(item));
    }

    // Recursively process children
    if (content.content) content.content = applySuperscript(content.content);
    if (content.stack) content.stack = applySuperscript(content.stack);
    if (content.table && content.table.body)
      content.table.body = applySuperscript(content.table.body);
  }

  return content;
}

export function downloadReportsPdf(
  htmlString: string,
  baseFileName = "Medical_Report"
): void {
  try {

    const styledHtml = normalizeTransparentCss(
      addControlledSpacingStyles(htmlString)
    );

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
      listType: "ul",
    });

    // Step 3: Process content for proper spacing and force full-width tables
    // let superscriptApplied = applySuperscript(converted);
    let processedContent: any = processContentSpacing(converted);

    processedContent = applySuperscript(processedContent);
    processedContent = applyRightAlignment(processedContent);
    processedContent = forceWhiteForTransparent(processedContent);

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

export async function generateReportsPdfBlob(
  htmlString: string | any
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      const styledHtml = normalizeTransparentCss(
        addControlledSpacingStyles(htmlString)
      );
      const converted = htmlToPdfmake(styledHtml, {
        tableAutoSize: true,
        listType: "ul",
      });

      // let superscriptApplied = applySuperscript(converted);
      let processedContent: any = processContentSpacing(converted);

      processedContent = applySuperscript(processedContent);
      processedContent = applyRightAlignment(processedContent);
      processedContent = forceWhiteForTransparent(processedContent);

      const documentDefinition: TDocumentDefinitions = {
        content: Array.isArray(processedContent)
          ? processedContent
          : [processedContent],
        defaultStyle: { fontSize: 10, lineHeight: 1.2 },
        pageSize: "A4",
        pageMargins: [40, 30, 40, 30],
      };

      const pdfDocGenerator = pdfMake.createPdf(documentDefinition);

      pdfDocGenerator.getBlob((blob: Blob) => {
        resolve(blob);
      });
    } catch (err) {
      reject(err);
    }
  });
}
