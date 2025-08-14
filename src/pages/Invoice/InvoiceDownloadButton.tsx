import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";
import { InvoiceHistory } from "@/services/invoiceService";
import { Download, Loader } from "lucide-react";

type Props = {
  invoiceHistory: InvoiceHistory;
};

const InvoiceDownloadButton = ({ invoiceHistory }: Props) => {

  console.log(invoiceHistory.refIHSignatureFile)

  return (
    <div >
      <PDFDownloadLink
        document={<InvoicePDF invoiceHistory={invoiceHistory} />}
        fileName={`Invoice_QT${invoiceHistory.refIHId + 1000}.pdf`}
      >
        {({ loading }) =>
          loading ? <Loader className="animate-spin h-5 w-5" /> : <Download />
        }
      </PDFDownloadLink>
    </div>
  );
};

export default InvoiceDownloadButton;
