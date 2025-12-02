import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";
import { InvoiceHistoryInvoice } from "@/services/invoiceService";
import { Download, Loader } from "lucide-react";
import InvoicePDFScribe from "./InvoicePDFScribe";
import InvoicePDFPPR from "./InvoicePDFPPR";

type Props = {
  type: string;
  invoiceHistory: InvoiceHistoryInvoice;
  CustId: string;
};

const InvoiceDownloadButton = ({ type, invoiceHistory, CustId }: Props) => {
  console.log(invoiceHistory);

  return (
    <div>
      {/* <PDFDownloadLink
        document={<InvoicePDF invoiceHistory={invoiceHistory} />}
        fileName={`Invoice_QT${invoiceHistory.refIHId + 1000}.pdf`}
      >
        {({ loading }) =>
          loading ? <Loader className="animate-spin h-5 w-5" /> : <Download />
        }
      </PDFDownloadLink> */}
      {type === "1" ? (
        <>
          <PDFDownloadLink
            document={<InvoicePDF invoiceHistory={invoiceHistory} />}
            fileName={`Invoice # ${
              invoiceHistory.refIHId + 1000
            } ${invoiceHistory.refIHFromDate.slice(0, 7)} ${CustId}.pdf`}
          >
            {({ loading }) =>
              loading ? (
                <Loader className="animate-spin h-5 w-5" />
              ) : (
                <Download />
              )
            }
          </PDFDownloadLink>
        </>
      ) : type === "2" && invoiceHistory.refRTId === 7 ? (
        <>
          {" "}
          <PDFDownloadLink
            document={<InvoicePDFScribe invoiceHistory={invoiceHistory} />}
            fileName={`Invoice # ${
              invoiceHistory.refIHId + 1000
            } ${invoiceHistory.refIHFromDate.slice(0, 7)} ${CustId}.pdf`}
          >
            {({ loading }) =>
              loading ? (
                <Loader className="animate-spin h-5 w-5" />
              ) : (
                <Download />
              )
            }
          </PDFDownloadLink>
        </>
      ) : (
        type === "2" && (
          <>
            <PDFDownloadLink
              document={<InvoicePDFPPR invoiceHistory={invoiceHistory} />}
              fileName={`Invoice # ${
                invoiceHistory.refIHId + 1000
              } ${invoiceHistory.refIHFromDate.slice(0, 7)} ${CustId}.pdf`}
            >
              {({ loading }) =>
                loading ? (
                  <Loader className="animate-spin h-5 w-5" />
                ) : (
                  <Download />
                )
              }
            </PDFDownloadLink>
          </>
        )
      )}
    </div>
  );
};

export default InvoiceDownloadButton;
