import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";

/**
 * Accepts an array of HTML strings, combines them into a single PDF and downloads.
 */
export function downloadReportsPdf(htmlString: string, baseFileName = "Report") {
  // Set up fonts
  pdfMake.vfs = pdfFonts.vfs;

  const converted = htmlToPdfmake(htmlString);

  const documentDefinition = {
      content: Array.isArray(converted) ? converted : [converted],
      defaultStyle: {
        fontSize: 12,
      },
    };

  const fileName = `${baseFileName}.pdf`;

  pdfMake.createPdf(documentDefinition).download(fileName);
}