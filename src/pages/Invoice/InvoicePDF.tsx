import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import PoppinsRegular from "./Poppins-Regular.ttf";
import PoppinsBold from "./Poppins-Bold.ttf";
import { InvoiceHistory } from "@/services/invoiceService";

type Props = {
  invoiceHistory: InvoiceHistory;
};

// Register Poppins font
Font.register({
  family: "Poppins",
  fonts: [
    { src: PoppinsRegular, fontWeight: "normal" },
    { src: PoppinsBold, fontWeight: "bold" },
  ],
});

// Styles using Poppins
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
    fontFamily: "Poppins",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  table: {
    marginTop: 20,
    borderTop: 1,
    borderBottom: 1,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: 1,
    paddingVertical: 5,
  },
  tableHeader: {
    fontWeight: "bold",
  },
  cellSmall: {
    width: "10%", // smaller width for S.No
    padding: 4,
  },
  cell: {
    flex: 1,
    paddingRight: 10,
  },
  declaration: {
    marginTop: 30,
    fontSize: 10,
  },
  signature: {
    marginTop: 20,
    fontSize: 10,
    alignSelf: "flex-end",
  },
});

const InvoicePDF = ({ invoiceHistory }: Props) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.heading}>Invoice</Text>

      {/* Top Section */}
      <View style={styles.row}>
        <View>
          <Text>No: {`Invoice_QT${invoiceHistory.refIHId + 1000}`}</Text>
          <Text>Date: {invoiceHistory.refIHCreatedAt.split(" ")[0]}</Text>
          <Text>
            Billing Period: {invoiceHistory.refIHFromDate} to{" "}
            {invoiceHistory.refIHToDate}
          </Text>
          <Text>Mode of Payment: {invoiceHistory.refIHModePayment}</Text>
          {invoiceHistory.refIHModePayment === "UPI" ? (
            <Text>UPI ID: {invoiceHistory.refIHUPIId}</Text>
          ) : (
            invoiceHistory.refIHModePayment === "BANK TRANSFER" && (
              <>
                <Text>
                  Holder Name: {invoiceHistory.refIHAccountHolderName}
                </Text>
                <Text>Number: {invoiceHistory.refIHAccountNo}</Text>
                <Text>Bank: {invoiceHistory.refIHAccountBank}</Text>
                <Text>Branch: {invoiceHistory.refIHAccountBranch}</Text>
                <Text>IFSC: {invoiceHistory.refIHAccountIFSC}</Text>
              </>
            )
          )}
        </View>

        <View>
          <Text style={{ fontWeight: "bold" }}>From:</Text>
          <Text>Name: {invoiceHistory.refIHFromName}</Text>
          <Text>Phone: {invoiceHistory.refIHFromPhoneNo}</Text>
          <Text>Email: {invoiceHistory.refIHFromEmail}</Text>
          <Text>PAN: {invoiceHistory.refIHFromPan}</Text>
          <Text>GSTIN: {invoiceHistory.refIHFromGST}</Text>
          <Text>Address: {invoiceHistory.refIHFromAddress}</Text>
          <Text style={{ fontWeight: "bold", marginTop: 10 }}>To:</Text>
          <Text>Name: {invoiceHistory.refIHToName}</Text>
          <Text>Address: {invoiceHistory.refIHToAddress}</Text>
        </View>
      </View>

      {/* Table Section */}
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.cellSmall}>S.No.</Text>
          <Text style={styles.cell}>Description</Text>
          <Text style={styles.cell}>Quantity</Text>
          <Text style={styles.cell}>Amount (INR)</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.cellSmall}>1.</Text>
          <Text style={styles.cell}>Number of Scans Reported</Text>
          <Text style={styles.cell}>{invoiceHistory.refIHQuantity}</Text>
          <Text style={styles.cell}>{invoiceHistory.refIHAmount}/-</Text>
        </View>
      </View>

      <View style={{ alignItems: "flex-end", marginTop: 10 }}>
        <Text style={{ fontWeight: "bold" }}>
          Total: {invoiceHistory.refIHTotal}/-
        </Text>
      </View>

      {/* Declaration */}
      <Text style={styles.declaration}>
        Declaration: I hereby declare that the information provided above is
        accurate, and the services listed have been duly completed during the
        billing period.
      </Text>

      <View style={styles.signature}>
        <Text>Signature:</Text>
        <Text>{invoiceHistory.refIHFromName}</Text>
        <Text>Date: {invoiceHistory.refIHCreatedAt.split(" ")[0]}</Text>
      </View>
    </Page>
  </Document>
);

export default InvoicePDF;
