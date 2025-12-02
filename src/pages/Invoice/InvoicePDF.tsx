import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import PoppinsRegular from "./Poppins-Regular.ttf";
import PoppinsBold from "./Poppins-Bold.ttf";
import PoppinsSemiBoldItalic from "./Poppins-SemiBoldItalic.ttf";
import { InvoiceHistoryInvoice } from "@/services/invoiceService";
import { formatReadableDate } from "@/utlis/calculateAge";

type Props = {
  invoiceHistory: InvoiceHistoryInvoice;
};

// Register Poppins font
Font.register({
  family: "Poppins",
  fonts: [
    { src: PoppinsRegular, fontWeight: "normal" },
    { src: PoppinsBold, fontWeight: "bold" },
    { src: PoppinsSemiBoldItalic, fontWeight: "semibold", fontStyle: "italic" },
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
    padding: 4,
  },
  cellbold: {
    flex: 1,
    paddingRight: 10,
    padding: 4,
    fontWeight: "bold",
  },
  declaration: {
    marginTop: 30,
    fontSize: 10,
    fontFamily: "Poppins",
    fontWeight: "semibold",
    fontStyle: "italic",
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
          {/* <Text>No: {`Invoice_QT${invoiceHistory.refIHId + 1000}`}</Text>
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
          )} */}
          <Text>{invoiceHistory.refIHFromName}</Text>
          <Text>{invoiceHistory.refIHFromEmail}</Text>
          <Text>{invoiceHistory.refIHFromPhoneNo}</Text>
          <Text>{invoiceHistory.refIHFromAddress}</Text>
        </View>

        <View>
          {/* <Text style={{ fontWeight: "bold" }}>From:</Text>
          <Text>Name: {invoiceHistory.refIHFromName}</Text>
          <Text>Phone: {invoiceHistory.refIHFromPhoneNo}</Text>
          <Text>Email: {invoiceHistory.refIHFromEmail}</Text>
          <Text>PAN: {invoiceHistory.refIHFromPan}</Text>
          <Text>GSTIN: {invoiceHistory.refIHFromGST}</Text>
          <Text>Address: {invoiceHistory.refIHFromAddress}</Text>
          <Text style={{ fontWeight: "bold", marginTop: 10 }}>To:</Text>
          <Text>Name: {invoiceHistory.refIHToName}</Text>
          <Text>Address: {invoiceHistory.refIHToAddress}</Text> */}
          <Text>{`Invoice # ${invoiceHistory.refIHId + 1000}`}</Text>
          <Text>
            Date:{" "}
            {formatReadableDate(invoiceHistory.refIHCreatedAt.split(" ")[0])}
          </Text>
        </View>
      </View>

      <View>
        <Text style={{ fontWeight: "bold", marginTop: 20 }}>To:</Text>
        <Text>{invoiceHistory.refIHToName}</Text>
        <Text>{invoiceHistory.refIHToAddress}</Text>
      </View>

      {/* Table Section */}
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.cellSmall}>S.No.</Text>
          <Text style={styles.cell}>Description</Text>
          <Text style={styles.cell}>Quantity</Text>
          <Text style={styles.cell}>Amount (USD)</Text>
          <Text style={styles.cell}>Total (USD)</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.cellSmall}>1.</Text>
          <Text style={styles.cell}>Total Case</Text>
          <Text style={styles.cell}>
            {invoiceHistory.refIHScanCenterTotalCase}
          </Text>
          <Text style={styles.cell}>
            {invoiceHistory.refIHScancentercaseAmount}
          </Text>
          <Text style={styles.cell}>
            {(invoiceHistory.refIHScanCenterTotalCase || 0) *
              (invoiceHistory.refIHScancentercaseAmount || 0)}
          </Text>
        </View>
        {invoiceHistory.otherExpenses &&
          invoiceHistory.otherExpenses.length > 0 && (
            <>
              {invoiceHistory.otherExpenses.map((data, index) => (
                <View style={styles.tableRow}>
                  <Text style={styles.cellSmall}>{index + 2}.</Text>
                  <View style={styles.cell}>
                    <Text style={{fontSize:"8px"}}>
                      {data.type === "plus"
                        ? "Addtional Amount"
                        : data.type === "minus" && "Deductible Amount"}
                    </Text>
                    <Text>{data.name}</Text>
                  </View>
                  <Text style={styles.cell}>-</Text>
                  <Text style={styles.cell}>{data.amount}</Text>
                  <Text style={styles.cell}>{data.amount}</Text>
                </View>
              ))}
            </>
          )}
        <View style={styles.tableRow}>
          <Text style={styles.cellSmall}></Text>
          <Text style={styles.cellbold}>Total Amount</Text>
          <Text style={styles.cellbold}>-</Text>
          <Text style={styles.cellbold}>-</Text>
          <Text style={styles.cellbold}>USD {invoiceHistory.refIHTotal}</Text>
        </View>
      </View>

      {/* <View style={{ alignItems: "flex-end", marginTop: 10 }}>
        <Text style={{ fontWeight: "bold" }}>
          Total: USD {invoiceHistory.refIHTotal}
        </Text>
      </View> */}

      {/* Declaration */}
      <Text style={styles.declaration}>
        Late payments are subject to a [1.5% per month] finance charge and may
        result in suspension of report delivery until payment is received.
      </Text>

      <View style={styles.signature}>
        {invoiceHistory.refIHSignature && (
          <Image
            src={
              invoiceHistory?.refIHSignatureFile?.base64Data
                ? `data:${invoiceHistory.refIHSignatureFile?.contentType};base64,${invoiceHistory.refIHSignatureFile?.base64Data}`
                : invoiceHistory.refIHSignature
            }
            // alt="Signature"
            style={{ width: "100px", objectFit: "contain" }}
          />
        )}
        <Text>Signature</Text>
      </View>

      {/* Declaration */}
      <Text style={{ fontSize: 11, fontFamily: "Poppins", marginTop: 20 }}>
        Below are the details of the new bank in the name of the company
        (Wellthgreen Theranostics).
      </Text>

      <View style={{ marginTop: 10 }}>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontWeight: "bold" }}>Bank Name: </Text>
          <Text>{invoiceHistory.refIHAccountBank}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontWeight: "bold" }}>Account Number: </Text>
          <Text>{invoiceHistory.refIHAccountNo}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontWeight: "bold" }}>ABA Routing Number: </Text>
          <Text>{invoiceHistory.refIHAccountIFSC}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default InvoicePDF;
