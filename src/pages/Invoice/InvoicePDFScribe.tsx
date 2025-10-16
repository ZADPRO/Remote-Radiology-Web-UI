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

const InvoicePDFScribe = ({ invoiceHistory }: Props) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.heading}>Invoice</Text>

      <View style={styles.row}>
        <View>
          <View>
            <Text style={{ fontWeight: "bold", marginTop: 10 }}>To:</Text>
            <Text>{invoiceHistory.refIHToName}</Text>
            <Text>{invoiceHistory.refIHToAddress}</Text>
          </View>

          <View>
            <Text style={{ fontWeight: "bold", marginTop: 20 }}>From:</Text>
            <Text>Name: {invoiceHistory.refIHFromName}</Text>
            <Text>Address: {invoiceHistory.refIHFromAddress}</Text>
            <Text>Phone: {invoiceHistory.refIHFromPhoneNo}</Text>
            <Text>Email: {invoiceHistory.refIHFromEmail}</Text>
            <Text>PAN: {invoiceHistory.refIHFromPan}</Text>
            {invoiceHistory.refIHFromGST && (
              <Text>GSTIN: {invoiceHistory.refIHFromGST}</Text>
            )}
            <Text>
              Invoice Date:{" "}
              {formatReadableDate(invoiceHistory.refIHCreatedAt.split(" ")[0])}
            </Text>
            <Text>
              Billing Period: {formatReadableDate(invoiceHistory.refIHFromDate)}{" "}
              to {formatReadableDate(invoiceHistory.refIHToDate)}
            </Text>
            <Text>Mode of Payment: {invoiceHistory.refIHModePayment}</Text>
            {invoiceHistory.refIHModePayment === "UPI" ? (
              <>
                <Text style={{ fontWeight: "bold", marginTop: 10 }}>
                  UPI Details:
                </Text>
                <Text style={{ marginLeft: 20 }}>
                  UPI ID: {invoiceHistory.refIHUPIId}
                </Text>
              </>
            ) : (
              invoiceHistory.refIHModePayment === "BANK TRANSFER" && (
                <>
                  <Text style={{ fontWeight: "bold", marginTop: 10 }}>
                    Bank Details:
                  </Text>
                  <Text style={{ marginLeft: 20 }}>
                    Account Name: {invoiceHistory.refIHAccountHolderName}
                  </Text>
                  <Text style={{ marginLeft: 20 }}>
                    Account Number: {invoiceHistory.refIHAccountNo}
                  </Text>
                  <Text style={{ marginLeft: 20 }}>
                    Bank & Branch: {invoiceHistory.refIHAccountBank} &{" "}
                    {invoiceHistory.refIHAccountBranch}
                  </Text>
                  <Text style={{ marginLeft: 20 }}>
                    IFSC: {invoiceHistory.refIHAccountIFSC}
                  </Text>
                </>
              )
            )}
          </View>
        </View>
        <View>
          <Text>{`Invoice # ${invoiceHistory.refIHId + 1000}`}</Text>
          <Text>
            Date:{" "}
            {formatReadableDate(invoiceHistory.refIHCreatedAt.split(" ")[0])}
          </Text>
        </View>
      </View>

      {/* Table Section */}
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.cellSmall}>S.No.</Text>
          <Text style={styles.cell}>Description</Text>
          <Text style={styles.cell}>Quantity</Text>
          <Text style={styles.cell}>Amount (INR)</Text>
          <Text style={styles.cell}>Total (INR)</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.cellSmall}>1.</Text>
          <Text style={styles.cell}>Total Case</Text>
          <Text style={styles.cell}>
            {invoiceHistory.refIHScribeTotalcasequantity}
          </Text>
          <Text style={styles.cell}>
            {invoiceHistory.refIHScribeTotalcaseamount}
          </Text>
          <Text style={styles.cell}>
            {(invoiceHistory.refIHScribeTotalcasequantity || 0) *
              (invoiceHistory.refIHScribeTotalcaseamount || 0)}
          </Text>
        </View>
        {invoiceHistory.otherExpenses &&
          invoiceHistory.otherExpenses.length > 0 && (
            <>
              {invoiceHistory.otherExpenses.map((data, index) => (
                <View style={styles.tableRow}>
                  <Text style={styles.cellSmall}>{index + 2}.</Text>
                  <Text style={styles.cell}>{data.name}</Text>
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
          <Text style={styles.cellbold}>INR {invoiceHistory.refIHTotal}</Text>
        </View>
      </View>

      {/* <View style={{ alignItems: "flex-end", marginTop: 10 }}>
        <Text style={{ fontWeight: "bold" }}>
          Total: INR {invoiceHistory.refIHTotal}
        </Text>
      </View> */}

      {/* Declaration */}
      <Text
        style={{
          fontSize: 11,
          fontFamily: "Poppins",
          marginTop: 20,
          fontWeight: "bold",
        }}
      >
        Declaration
      </Text>
      <Text style={{ fontSize: 11, fontFamily: "Poppins" }}>
        I hereby declare that the information provided above is accurate, and
        the services listed have been duly completed during the billing period.
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
    </Page>
  </Document>
);

export default InvoicePDFScribe;
