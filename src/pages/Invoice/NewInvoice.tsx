// import DatePicker from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import LoadingOverlay from "@/components/ui/CustomComponents/loadingOverlay";
import { Input } from "@/components/ui/input";
import logoNew from "../../assets/LogoNew.png";
import addRadiologist_Bg from "../../assets/Add Admins/Add Radiologist BG.png";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  InvoiceInput,
  invoiceServie,
  OtherExpensesModel,
} from "@/services/invoiceService";
import { ArrowLeft, Loader, Minus, Plus, Trash } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
// import { parseLocalDate } from "@/lib/dateUtils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import SignatureCanvas from "react-signature-canvas";
import { uploadService } from "@/services/commonServices";
import DefaultDatePicker from "@/components/DefaultDatePicker";

type Props = {};

const NewInvoice: React.FC<Props> = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const { type, id, date } = location.state || {};

  const [loading, setLoading] = useState(false);

  const [userAccess, setUserAccess] = useState(0);

  const [input, setInput] = useState<InvoiceInput>({
    refSCId: 0,
    refUserId: 0,
    fromId: 0,
    fromName: "",
    fromPhone: "",
    fromEmail: "",
    fromPan: "",
    fromGst: "",
    fromAddress: "",
    toId: 0,
    toName: "",
    toAddress: "",
    billingfrom: "",
    billingto: "",
    modeofpayment: "UPI",
    upiId: "",
    accountHolderName: "",
    accountNumber: "",
    bank: "",
    branch: "",
    ifsc: "",
    refIHSFormquantity: null,
    refIHSFormamount: null,
    refIHDaFormquantity: null,
    refIHDaFormamount: null,
    refIHDbFormquantity: null,
    refIHDbFormamount: null,
    refIHDcFormquantity: null,
    refIHDcFormamount: null,
    refIHxFormquantity: null,
    refIHxFormamount: null,
    refIHEditquantity: null,
    refIHEditFormamount: null,
    refTADScribeTotalcasequantity: null,
    refTADScribeTotalcaseamount: null,
    refScanCenterTotalCase: null,
    refScancentercaseAmount: null,
    total: 0,
    signature: "",
  });

  const [otherExpenses, setOtherExpenses] = useState<OtherExpensesModel[]>([]);
  const [deductibleExpenses, setDeductibleExpenses] = useState<
    OtherExpensesModel[]
  >([]);

  useEffect(() => {
    setLoading(true);
    console.log("Type:", type);
    console.log("ID:", id);
    console.log(
      "Date:",
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    );

    function getMonthStartEnd(monthStr: string) {
      const startDate = `${monthStr}-01`;
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + 1); // move to next month
      date.setDate(0); // go back to last day of the original month

      const endDate = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      return { startDate, endDate };
    }

    invoiceServie
      .getInvoiceData(
        parseInt(type),
        parseInt(id),
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      )
      .then((res) => {
        console.log(res);
        if (res.status) {
          if (type === "1") {
            setUserAccess(3);
          } else {
            setUserAccess(
              res.UserData[0].refRTId === 10
                ? 1
                : res.UserData[0].refRTId === 6
                ? 1
                : res.UserData[0].refRTId === 7
                ? 2
                : 0
            );
          }
          const { startDate, endDate } = getMonthStartEnd(
            `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
              2,
              "0"
            )}`
          );
          console.log(startDate, endDate, res);
          if (type === "1") {
            setInput((prev) => ({
              ...prev,
              refSCId: parseInt(id),
              refUserId: 0,
              fromId: 0,
              fromName: "Wellthgreen Theranostics",
              fromAddress: "6240/304, Randi Avenue, Woodland hills, CA 91367.",
              modeofpayment: "BANK TRANSFER",
              toId: res.ScancenterData[0].refSCId,
              toName: res.ScancenterData[0].refSCName,
              toAddress: res.ScancenterData[0].refSCAddress,
              billingfrom: startDate,
              billingto: endDate,
              refIHSFormquantity:
                (res.UserCount && res.UserCount[0].SForm) || 0,
              refIHSFormamount: parseInt(res.refTASform || "0"),
              refIHDaFormquantity:
                (res.UserCount && res.UserCount[0].DaForm) || 0,
              refIHDaFormamount: parseInt(res.refTADaform || "0"),
              refIHDbFormquantity:
                (res.UserCount && res.UserCount[0].DbForm) || 0,
              refIHDbFormamount: parseInt(res.refTADbform || "0"),
              refIHDcFormquantity:
                (res.UserCount && res.UserCount[0].DcForm) || 0,
              refIHDcFormamount: parseInt(res.refTADcform || "0"),
              refIHxFormquantity:
                (res.UserCount && res.UserCount[0].xForm) || 0,
              refIHxFormamount: parseInt(res.refTAXform || "0"),
              refIHEditquantity:
                (res.UserCount && res.UserCount[0].editForm) || 0,
              refIHEditFormamount: parseInt(res.refTAEditform || "0"),
              refTADScribeTotalcasequantity: 0,
              refTADScribeTotalcaseamount: parseInt(
                res.refTADScribeTotalcase || "0"
              ),
              refScanCenterTotalCase:
                res.ScanCenterCount[0].total_appointments || 0,
            }));
          } else if (type === "2") {
            setInput((prev) => ({
              ...prev,
              refSCId: 0,
              refUserId: parseInt(id),
              fromId: parseInt(id),
              fromName: res.UserData[0].refUserFirstName,
              fromPhone: res.UserData[0].refCODOPhoneNo1,
              fromEmail: res.UserData[0].refCODOEmail,
              fromPan: res.UserData[0].refPan,
              toId: 0,
              toName: "Wellthgreen Theranostics",
              fromAddress: "6240/304, Randi Avenue, Woodland hills, CA 91367.",
              billingfrom: startDate,
              billingto: endDate,
              refIHSFormquantity:
                (res.UserCount && res.UserCount[0].SForm) || 0,
              refIHSFormamount: parseInt(res.refTASform || "0"),
              refIHDaFormquantity:
                (res.UserCount && res.UserCount[0].DaForm) || 0,
              refIHDaFormamount: parseInt(res.refTADaform || "0"),
              refIHDbFormquantity:
                (res.UserCount && res.UserCount[0].DbForm) || 0,
              refIHDbFormamount: parseInt(res.refTADbform || "0"),
              refIHDcFormquantity:
                (res.UserCount && res.UserCount[0].DcForm) || 0,
              refIHDcFormamount: parseInt(res.refTADcform || "0"),
              refIHxFormquantity:
                (res.UserCount && res.UserCount[0].xForm) || 0,
              refIHxFormamount: parseInt(res.refTAXform || "0"),
              refIHEditquantity:
                (res.UserCount && res.UserCount[0].editForm) || 0,
              refIHEditFormamount: parseInt(res.refTAEditform || "0"),
              refTADScribeTotalcasequantity:
                res.UserCount[0].total_appointments || 0,
              refTADScribeTotalcaseamount: parseInt(
                res.refTADScribeTotalcase || "0"
              ),
              refScanCenterTotalCase: 0,
            }));
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });

    setLoading(false);
  }, []);

  useEffect(() => {
    const n = (x: number | null | undefined) => Number(x || 0);
    let total = 0;

    if (userAccess === 1) {
      total += n(input.refIHSFormquantity) * n(input.refIHSFormamount);
      total += n(input.refIHDaFormquantity) * n(input.refIHDaFormamount);
      total += n(input.refIHDbFormquantity) * n(input.refIHDbFormamount);
      total += n(input.refIHDcFormquantity) * n(input.refIHDcFormamount);
      total += n(input.refIHxFormquantity) * n(input.refIHxFormamount);
      total -= n(input.refIHEditquantity) * n(input.refIHEditFormamount);
    } else if (userAccess === 2) {
      total +=
        n(input.refTADScribeTotalcasequantity) *
        n(input.refTADScribeTotalcaseamount);
    } else if (userAccess === 3) {
      total +=
        n(input.refScanCenterTotalCase) * n(input.refScancentercaseAmount);
    }

    const otherTotal = otherExpenses.reduce(
      (sum, exp) => sum + n(exp.amount),
      0
    );
    total += otherTotal;
    const deductableTotal = deductibleExpenses.reduce(
      (sum, exp) => sum + n(exp.amount),
      0
    );
    total -= deductableTotal;
    setInput((prev) => ({ ...prev, total }));
  }, [
    userAccess,
    input.refIHSFormamount,
    input.refIHSFormquantity,
    input.refIHDaFormamount,
    input.refIHDaFormquantity,
    input.refIHDbFormamount,
    input.refIHDbFormquantity,
    input.refIHDcFormamount,
    input.refIHDcFormquantity,
    input.refIHxFormamount,
    input.refIHxFormquantity,
    input.refIHEditFormamount,
    input.refIHEditquantity,
    input.refTADScribeTotalcasequantity,
    input.refTADScribeTotalcaseamount,
    input.refScanCenterTotalCase,
    input.refScancentercaseAmount,
    otherExpenses,
    deductibleExpenses,
  ]);

  const handleInputChanges = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitInvoice = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    if (input.signature.length === 0) {
      toast.error("Required Signature");
      setLoading(false);
      return;
    }

    console.log(
      "NewInvoice.tsx -------------------------- >  290 Helooooooooooooooooooo "
    );
    invoiceServie
      .generateInvoice(input, otherExpenses, deductibleExpenses)
      .then((res) => {
        console.log(res);
        if (res.status) {
          toast.success(res.message);
          // setTimeout(() => {
          navigate(-1);
          // }, 1000);
        } else {
          toast.error(res.message);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [dialogOpen, setDialogOpen] = useState(false);

  const sigCanvas = useRef<SignatureCanvas | null>(null);
  const [trimmedDataURL, setTrimmedDataURL] = useState<string | null>(null);

  const signUpload = async (file: File) => {
    setLoading(true);
    const formDataObj = new FormData();
    formDataObj.append("file", file);
    try {
      const response = await uploadService.uploadImage(file);
      if (response.status) {
        const cleanUrl = response.viewURL.includes("?")
          ? response.viewURL.split("?")[0]
          : response.viewURL;
        setInput((prev) => ({
          ...prev,
          signature: cleanUrl,
        }));
        console.log(`Upload successful for file: ${file.name}`);
      } else {
        console.log(`Upload failed for file: ${file.name}`);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const previewSignature = () => {
    if (!sigCanvas.current) return;

    // You can replace getCanvas() with getTrimmedCanvas() if you want to trim whitespace
    const dataUrl = sigCanvas.current.getCanvas().toDataURL("image/png");
    setTrimmedDataURL(dataUrl);

    // Also store the file for later upload
    // sigCanvas.current.getCanvas().toBlob((blob) => {
    //   if (!blob) return;
    //   const fileObj = new File([blob], "signature.png", { type: "image/png" });
    //   setFile(fileObj);
    // });
  };

  const saveSignature = async () => {
    if (!sigCanvas.current) return;

    // Convert canvas to Blob and upload
    sigCanvas.current.getCanvas().toBlob((blob) => {
      if (!blob) return;
      const fileObj = new File([blob], "signature.png", { type: "image/png" });
      previewSignature();
      signUpload(fileObj);
      setDialogOpen(false);
    });
  };

  const clear = () => {
    sigCanvas.current?.clear();
  };

  // ✅ Add new expense
  const handleAddExpense = () => {
    setOtherExpenses([...otherExpenses, { name: "", amount: 0 }]);
  };

  // ✅ Delete expense by index
  const handleDeleteExpense = (index: number) => {
    const updated = [...otherExpenses];
    updated.splice(index, 1);
    setOtherExpenses(updated);
  };

  // ✅ Add new expense
  const handleAddExpenseDeductable = () => {
    setDeductibleExpenses([...deductibleExpenses, { name: "", amount: 0 }]);
  };

  // ✅ Delete expense by index
  const handleDeleteExpenseDeductable = (index: number) => {
    const updated = [...deductibleExpenses];
    updated.splice(index, 1);
    setDeductibleExpenses(updated);
  };

  // ✅ Handle change for both fields
  const handleChange = (
    index: number,
    field: keyof OtherExpensesModel,
    value: string | number
  ) => {
    const updated = [...otherExpenses];
    updated[index][field] = value as never;
    setOtherExpenses(updated);
  };

  const handleChangeDeductable = (
    index: number,
    field: keyof OtherExpensesModel,
    value: string | number
  ) => {
    const updated = [...deductibleExpenses];
    updated[index][field] = value as never;
    setDeductibleExpenses(updated);
  };

  return (
    <div className="flex w-full flex-col bg-[#edd1ce] min-h-screen">
      {loading && <LoadingOverlay />}
      {dialogOpen && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="p-4 max-w-xl">
            <SignatureCanvas
              ref={sigCanvas}
              canvasProps={{
                width: 500,
                height: 200,
                className: "border border-gray-300 rounded",
              }}
            />
            <div className="flex gap-2">
              <Button variant="secondary" onClick={clear}>
                Clear
              </Button>
              <Button onClick={saveSignature}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitInvoice();
        }}
        className="w-full flex flex-col items-center"
      >
        {/* Header */}
        <div
          className="p-2 w-full flex gap-3 sm:gap-5 items-center bg-[#A3B1A1] lg:bg-[length:70%_100%] lg:bg-no-repeat lg:bg-right-top"
          style={{
            backgroundImage:
              window.innerWidth >= 1024
                ? `url(${addRadiologist_Bg})`
                : undefined,
          }}
        >
          <div className="w-full flex items-center justify-between px-3 sm:px-4">
            {/* Logo (Left) */}
            <img
              src={logoNew}
              alt="logoNew"
              className="h-10 sm:h-12 lg:h-14 object-contain"
            />

            {/* Title (Center) */}
            <div className="flex-1 text-center">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold">
                Invoice
              </h2>
            </div>

            {/* Spacer to balance alignment */}
            <div className="w-20 sm:w-24" />
          </div>
        </div>

        {/* Back Button */}
        <div className="w-full px-3 sm:px-5 pt-2">
          <Button
            type="button"
            variant="link"
            className="self-start flex text-foreground font-semibold items-center gap-1 sm:gap-2 p-0"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-base sm:text-lg font-semibold">Back</span>
          </Button>
        </div>

        {/* Main Form Content */}
        <div className="px-4 sm:px-6 lg:px-10 w-full max-w-7xl pt-2 pb-6 sm:pb-10 flex flex-col gap-6 lg:gap-0 lg:flex-row justify-between">
          {/* From/To Section */}
          <div className="w-full lg:w-[30%] xl:w-[25%] flex flex-col gap-3 sm:gap-4">
            <div className="space-y-3 sm:space-y-4">
              <p className="text-sm sm:text-base font-bold">From</p>
              <Input
                type="text"
                value={input.fromName}
                name="fromName"
                onChange={handleInputChanges}
                required
                placeholder="Name"
                className="w-full text-xs sm:text-sm h-9 sm:h-10"
                readOnly
              />
              <Input
                type="text"
                value={input.fromPhone}
                name="fromPhone"
                onChange={handleInputChanges}
                required
                readOnly={type === "2"}
                placeholder="Phone Number"
                className="w-full text-xs sm:text-sm h-9 sm:h-10"
              />
              <Input
                type="email"
                value={input.fromEmail}
                name="fromEmail"
                onChange={handleInputChanges}
                required
                readOnly={type === "2"}
                placeholder="Email"
                className="w-full text-xs sm:text-sm h-9 sm:h-10"
              />
              {userAccess !== 3 && (
                <>
                  <Input
                    type="text"
                    value={input.fromPan}
                    name="fromPan"
                    onChange={handleInputChanges}
                    placeholder="PAN"
                    className="w-full text-xs sm:text-sm h-9 sm:h-10"
                  />
                  <Input
                    type="text"
                    value={input.fromGst}
                    name="fromGst"
                    onChange={handleInputChanges}
                    placeholder="GST"
                    className="w-full text-xs sm:text-sm h-9 sm:h-10"
                  />
                </>
              )}
              <Textarea
                value={input.fromAddress}
                name="fromAddress"
                onChange={(e) => {
                  setInput((prev) => ({
                    ...prev,
                    fromAddress: e.target.value,
                  }));
                }}
                required
                placeholder="Address"
                className="w-full text-xs sm:text-sm min-h-[80px] sm:min-h-[100px] resize-none"
              />
            </div>

            <div className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
              <p className="text-sm sm:text-base font-bold">To</p>
              <Input
                type="text"
                value={input.toName}
                name="toName"
                onChange={handleInputChanges}
                required
                placeholder="Name"
                className="w-full text-xs sm:text-sm h-9 sm:h-10"
                readOnly
              />
              <Textarea
                value={input.toAddress}
                name="toAddress"
                onChange={(e) => {
                  setInput((prev) => ({
                    ...prev,
                    toAddress: e.target.value,
                  }));
                }}
                required
                placeholder="Address"
                className="w-full text-xs sm:text-sm min-h-[80px] sm:min-h-[100px] resize-none"
                readOnly={type === "1"}
              />
            </div>
          </div>

          {/* Billing Period and Payment Section */}
          <div className="w-full lg:w-[30%] xl:w-[25%] flex flex-col gap-3 sm:gap-4">
            <div className="space-y-3 sm:space-y-4">
              <p className="text-sm sm:text-base font-bold">Billing Period</p>
              <div className="flex flex-col gap-2 sm:gap-3 items-center">
                <div className="w-full">
                  {/* <DatePicker
                    value={
                      input.billingfrom
                        ? parseLocalDate(input.billingfrom)
                        : undefined
                    }
                    placeholder="From Date"
                    disabled
                  /> */}
                  <DefaultDatePicker value={input.billingfrom} disabled />
                </div>
                <p className="text-sm sm:text-base font-bold">To</p>
                <div className="w-full">
                  {/* <DatePicker
                    value={
                      input.billingto
                        ? parseLocalDate(input.billingto)
                        : undefined
                    }
                    placeholder="To Date"
                    disabled
                  /> */}
                  <DefaultDatePicker value={input.billingto} disabled />
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
              <Select
                value={input.modeofpayment}
                onValueChange={(val) => {
                  setInput((prev) => ({
                    ...prev,
                    modeofpayment: val,
                  }));
                }}
                required
              >
                <SelectTrigger className="bg-[#fff] font-medium text-xs sm:text-sm w-full h-9 sm:h-10">
                  <SelectValue placeholder="Mode of Payment" />
                </SelectTrigger>
                <SelectContent>
                  {userAccess !== 3 && (
                    <>
                      <SelectItem
                        key={1}
                        value="UPI"
                        className="text-xs sm:text-sm"
                      >
                        UPI
                      </SelectItem>
                    </>
                  )}
                  <SelectItem
                    key={2}
                    value="BANK TRANSFER"
                    className="text-xs sm:text-sm"
                  >
                    Bank Transfer
                  </SelectItem>
                </SelectContent>
              </Select>

              {input.modeofpayment === "UPI" ? (
                <Input
                  type="text"
                  value={input.upiId}
                  name="upiId"
                  onChange={handleInputChanges}
                  required
                  placeholder="UPI ID"
                  className="w-full text-xs sm:text-sm h-9 sm:h-10"
                />
              ) : (
                input.modeofpayment === "BANK TRANSFER" && (
                  <div className="space-y-3 sm:space-y-4">
                    {userAccess !== 3 ? (
                      <>
                        <Input
                          type="text"
                          value={input.accountHolderName}
                          name="accountHolderName"
                          onChange={handleInputChanges}
                          required
                          placeholder="Account Holder Name"
                          className="w-full text-xs sm:text-sm h-9 sm:h-10"
                        />
                        <Input
                          type="text"
                          value={input.accountNumber}
                          name="accountNumber"
                          onChange={handleInputChanges}
                          required
                          placeholder="Account Number"
                          className="w-full text-xs sm:text-sm h-9 sm:h-10"
                        />
                        <Input
                          type="text"
                          value={input.bank}
                          name="bank"
                          onChange={handleInputChanges}
                          required
                          placeholder="Bank"
                          className="w-full text-xs sm:text-sm h-9 sm:h-10"
                        />
                        <Input
                          type="text"
                          value={input.branch}
                          name="branch"
                          onChange={handleInputChanges}
                          required
                          placeholder="Branch"
                          className="w-full text-xs sm:text-sm h-9 sm:h-10"
                        />
                        <Input
                          type="text"
                          value={input.ifsc}
                          name="ifsc"
                          onChange={handleInputChanges}
                          required
                          placeholder="IFSC"
                          className="w-full text-xs sm:text-sm h-9 sm:h-10"
                        />
                      </>
                    ) : (
                      <>
                        <Input
                          type="text"
                          value={input.bank}
                          name="bank"
                          onChange={handleInputChanges}
                          required
                          placeholder="Bank Name"
                          className="w-full text-xs sm:text-sm h-9 sm:h-10"
                        />
                        <Input
                          type="text"
                          value={input.accountNumber}
                          name="accountNumber"
                          onChange={handleInputChanges}
                          required
                          placeholder="Account Number"
                          className="w-full text-xs sm:text-sm h-9 sm:h-10"
                        />
                        <Input
                          type="text"
                          value={input.ifsc}
                          name="ifsc"
                          onChange={handleInputChanges}
                          required
                          placeholder="ABA Routing Number"
                          className="w-full text-xs sm:text-sm h-9 sm:h-10"
                        />
                      </>
                    )}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Invoice Details Section */}
          <div className="w-full lg:w-[35%] flex flex-col gap-3 sm:gap-4">
            <div className="space-y-3 sm:space-y-4">
              <p className="text-sm sm:text-base font-bold">Invoice Details</p>
              <div className="bg-[#a4b2a1] rounded-sm">
                <div className="bg-[#f8f2ea] rounded-sm gap-3 sm:gap-4 flex flex-col w-full py-3 sm:py-4 px-2 sm:px-3">
                  {userAccess === 1 && (
                    <>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <div className="w-full flex flex-col gap-1 sm:gap-2">
                          <p className="text-xs sm:text-sm font-bold">S Form</p>
                          <Input
                            type="number"
                            value={input.refIHSFormquantity || "0"}
                            name="sformeditquantity"
                            onChange={(e) => {
                              setInput({
                                ...input,
                                refIHSFormquantity: parseInt(e.target.value),
                              });
                            }}
                            required
                            placeholder="Quantity"
                            className="w-full text-xs sm:text-sm h-8 sm:h-9"
                            // readOnly={!(role?.type == "admin")}
                          />
                        </div>
                        <div className="w-full flex flex-col gap-1 sm:gap-2">
                          <p className="text-xs sm:text-sm font-bold">Amount</p>
                          <Input
                            type="number"
                            value={input.refIHSFormamount || "0"}
                            name="sformeditamount"
                            onChange={(e) => {
                              setInput({
                                ...input,
                                refIHSFormamount: parseInt(e.target.value),
                              });
                            }}
                            required
                            placeholder="Amount"
                            className="w-full text-xs sm:text-sm h-8 sm:h-9"
                            // readOnly={!(role?.type == "admin")}
                          />
                        </div>
                        <div className="w-full flex flex-col gap-1 sm:gap-2">
                          <p className="text-xs sm:text-sm font-bold">
                            Total Amount
                          </p>
                          <Input
                            type="number"
                            value={
                              (input.refIHSFormquantity || 0) *
                              (input.refIHSFormamount || 0)
                            }
                            name="sformedittotal"
                            required
                            placeholder="Amount"
                            className="w-full text-xs sm:text-sm h-8 sm:h-9"
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <div className="w-full flex flex-col gap-1 sm:gap-2">
                          <p className="text-xs sm:text-sm font-bold">
                            Da Form
                          </p>
                          <Input
                            type="number"
                            value={input.refIHDaFormquantity || "0"}
                            name="sformeditquantity"
                            onChange={(e) => {
                              setInput({
                                ...input,
                                refIHDaFormquantity: parseInt(e.target.value),
                              });
                            }}
                            required
                            placeholder="Quantity"
                            className="w-full text-xs sm:text-sm h-8 sm:h-9"
                            // readOnly={!(role?.type == "admin")}
                          />
                        </div>
                        <div className="w-full flex flex-col gap-1 sm:gap-2">
                          <p className="text-xs sm:text-sm font-bold">Amount</p>
                          <Input
                            type="number"
                            value={input.refIHDaFormamount || "0"}
                            name="sformeditamount"
                            onChange={(e) => {
                              setInput({
                                ...input,
                                refIHDaFormamount: parseInt(e.target.value),
                              });
                            }}
                            required
                            placeholder="Amount"
                            className="w-full text-xs sm:text-sm h-8 sm:h-9"
                            // readOnly={!(role?.type == "admin")}
                          />
                        </div>
                        <div className="w-full flex flex-col gap-1 sm:gap-2">
                          <p className="text-xs sm:text-sm font-bold">
                            Total Amount
                          </p>
                          <Input
                            type="number"
                            value={
                              (input.refIHDaFormquantity || 0) *
                              (input.refIHDaFormamount || 0)
                            }
                            name="sformedittotal"
                            required
                            placeholder="Amount"
                            className="w-full text-xs sm:text-sm h-8 sm:h-9"
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <div className="w-full flex flex-col gap-1 sm:gap-2">
                          <p className="text-xs sm:text-sm font-bold">
                            Db Form
                          </p>
                          <Input
                            type="number"
                            value={input.refIHDbFormquantity || "0"}
                            name="sformeditquantity"
                            onChange={(e) => {
                              setInput({
                                ...input,
                                refIHDbFormquantity: parseInt(e.target.value),
                              });
                            }}
                            required
                            placeholder="Quantity"
                            className="w-full text-xs sm:text-sm h-8 sm:h-9"
                            // readOnly={!(role?.type == "admin")}
                          />
                        </div>
                        <div className="w-full flex flex-col gap-1 sm:gap-2">
                          <p className="text-xs sm:text-sm font-bold">Amount</p>
                          <Input
                            type="number"
                            value={input.refIHDbFormamount || "0"}
                            name="sformeditamount"
                            onChange={(e) => {
                              setInput({
                                ...input,
                                refIHDbFormamount: parseInt(e.target.value),
                              });
                            }}
                            required
                            placeholder="Amount"
                            className="w-full text-xs sm:text-sm h-8 sm:h-9"
                            // readOnly={!(role?.type == "admin")}
                          />
                        </div>
                        <div className="w-full flex flex-col gap-1 sm:gap-2">
                          <p className="text-xs sm:text-sm font-bold">
                            Total Amount
                          </p>
                          <Input
                            type="number"
                            value={
                              (input.refIHDbFormquantity || 0) *
                              (input.refIHDbFormamount || 0)
                            }
                            name="sformedittotal"
                            required
                            placeholder="Amount"
                            className="w-full text-xs sm:text-sm h-8 sm:h-9"
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <div className="w-full flex flex-col gap-1 sm:gap-2">
                          <p className="text-xs sm:text-sm font-bold">
                            Dc Form
                          </p>
                          <Input
                            type="number"
                            value={input.refIHDcFormquantity || "0"}
                            name="sformeditquantity"
                            onChange={(e) => {
                              setInput({
                                ...input,
                                refIHDcFormquantity: parseInt(e.target.value),
                              });
                            }}
                            required
                            placeholder="Quantity"
                            className="w-full text-xs sm:text-sm h-8 sm:h-9"
                            // readOnly={!(role?.type == "admin")}
                          />
                        </div>
                        <div className="w-full flex flex-col gap-1 sm:gap-2">
                          <p className="text-xs sm:text-sm font-bold">Amount</p>
                          <Input
                            type="number"
                            value={input.refIHDcFormamount || "0"}
                            name="sformeditamount"
                            onChange={(e) => {
                              setInput({
                                ...input,
                                refIHDcFormamount: parseInt(e.target.value),
                              });
                            }}
                            required
                            placeholder="Amount"
                            className="w-full text-xs sm:text-sm h-8 sm:h-9"
                            // readOnly={!(role?.type == "admin")}
                          />
                        </div>
                        <div className="w-full flex flex-col gap-1 sm:gap-2">
                          <p className="text-xs sm:text-sm font-bold">
                            Total Amount
                          </p>
                          <Input
                            type="number"
                            value={
                              (input.refIHDcFormquantity || 0) *
                              (input.refIHDcFormamount || 0)
                            }
                            name="sformedittotal"
                            required
                            placeholder="Amount"
                            className="w-full text-xs sm:text-sm h-8 sm:h-9"
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <div className="w-full flex flex-col gap-1 sm:gap-2">
                          <p className="text-xs sm:text-sm font-bold">X Form</p>
                          <Input
                            type="number"
                            value={input.refIHxFormquantity || "0"}
                            name="sformeditquantity"
                            onChange={(e) => {
                              setInput({
                                ...input,
                                refIHxFormquantity: parseInt(e.target.value),
                              });
                            }}
                            required
                            placeholder="Quantity"
                            className="w-full text-xs sm:text-sm h-8 sm:h-9"
                            // readOnly={!(role?.type == "admin")}
                          />
                        </div>
                        <div className="w-full flex flex-col gap-1 sm:gap-2">
                          <p className="text-xs sm:text-sm font-bold">Amount</p>
                          <Input
                            type="number"
                            value={input.refIHxFormamount || "0"}
                            name="sformeditamount"
                            onChange={(e) => {
                              setInput({
                                ...input,
                                refIHxFormamount: parseInt(e.target.value),
                              });
                            }}
                            required
                            placeholder="Amount"
                            className="w-full text-xs sm:text-sm h-8 sm:h-9"
                            // readOnly={!(role?.type == "admin")}
                          />
                        </div>
                        <div className="w-full flex flex-col gap-1 sm:gap-2">
                          <p className="text-xs sm:text-sm font-bold">
                            Total Amount
                          </p>
                          <Input
                            type="number"
                            value={
                              (input.refIHxFormquantity || 0) *
                              (input.refIHxFormamount || 0)
                            }
                            name="sformedittotal"
                            required
                            placeholder="Amount"
                            className="w-full text-xs sm:text-sm h-8 sm:h-9"
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <div className="w-full flex flex-col gap-1 sm:gap-2">
                          <p className="text-xs sm:text-sm font-bold">
                            Edit Form
                          </p>
                          <Input
                            type="number"
                            value={input.refIHEditquantity || "0"}
                            name="sformeditquantity"
                            onChange={(e) => {
                              setInput({
                                ...input,
                                refIHEditquantity: parseInt(e.target.value),
                              });
                            }}
                            required
                            placeholder="Quantity"
                            className="w-full text-xs sm:text-sm h-8 sm:h-9"
                            // readOnly={!(role?.type == "admin")}
                          />
                        </div>
                        <div className="w-full flex flex-col gap-1 sm:gap-2">
                          <p className="text-xs sm:text-sm font-bold">Amount</p>
                          <Input
                            type="number"
                            value={input.refIHEditFormamount || "0"}
                            name="sformeditamount"
                            onChange={(e) => {
                              setInput({
                                ...input,
                                refIHEditFormamount: parseInt(e.target.value),
                              });
                            }}
                            required
                            placeholder="Amount"
                            className="w-full text-xs sm:text-sm h-8 sm:h-9"
                            // readOnly={!(role?.type == "admin")}
                          />
                        </div>
                        <div className="w-full flex flex-col gap-1 sm:gap-2">
                          <p className="text-xs sm:text-sm font-bold">
                            Total Amount
                          </p>
                          <Input
                            type="number"
                            value={
                              (input.refIHEditquantity || 0) *
                              (input.refIHEditFormamount || 0)
                            }
                            name="sformedittotal"
                            required
                            placeholder="Amount"
                            className="w-full text-xs sm:text-sm h-8 sm:h-9"
                            readOnly
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {userAccess === 2 && (
                    <>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <div className="w-full flex flex-col gap-1 sm:gap-2">
                          <p className="text-xs sm:text-sm font-bold">
                            Total Case
                          </p>
                          <Input
                            type="number"
                            value={input.refTADScribeTotalcasequantity || "0"}
                            name="sformeditquantity"
                            onChange={(e) => {
                              setInput({
                                ...input,
                                refTADScribeTotalcasequantity: parseInt(
                                  e.target.value
                                ),
                              });
                            }}
                            required
                            placeholder="Quantity"
                            className="w-full text-xs sm:text-sm h-8 sm:h-9"
                            // readOnly={!(role?.type == "admin")}
                          />
                        </div>
                        <div className="w-full flex flex-col gap-1 sm:gap-2">
                          <p className="text-xs sm:text-sm font-bold">Amount</p>
                          <Input
                            type="number"
                            value={input.refTADScribeTotalcaseamount || "0"}
                            name="sformeditamount"
                            onChange={(e) => {
                              setInput({
                                ...input,
                                refTADScribeTotalcaseamount: parseInt(
                                  e.target.value
                                ),
                              });
                            }}
                            required
                            placeholder="Amount"
                            className="w-full text-xs sm:text-sm h-8 sm:h-9"
                            // readOnly={!(role?.type == "admin")}
                          />
                        </div>
                        <div className="w-full flex flex-col gap-1 sm:gap-2">
                          <p className="text-xs sm:text-sm font-bold">
                            Total Amount
                          </p>
                          <Input
                            type="number"
                            value={
                              (input.refTADScribeTotalcasequantity || 0) *
                              (input.refTADScribeTotalcaseamount || 0)
                            }
                            name="sformedittotal"
                            required
                            placeholder="Amount"
                            className="w-full text-xs sm:text-sm h-8 sm:h-9"
                            readOnly
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {userAccess === 3 && (
                    <>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <div className="w-full flex flex-col gap-1 sm:gap-2">
                          <p className="text-xs sm:text-sm font-bold">
                            Total Case
                          </p>
                          <Input
                            type="number"
                            value={input.refScanCenterTotalCase || "0"}
                            name="sformeditquantity"
                            onChange={(e) => {
                              setInput({
                                ...input,
                                refScanCenterTotalCase: parseInt(
                                  e.target.value
                                ),
                              });
                            }}
                            required
                            placeholder="Quantity"
                            className="w-full text-xs sm:text-sm h-8 sm:h-9"
                            // readOnly={!(role?.type == "admin")}
                          />
                        </div>
                        <div className="w-full flex flex-col gap-1 sm:gap-2">
                          <p className="text-xs sm:text-sm font-bold">Amount</p>
                          <Input
                            type="number"
                            value={input.refScancentercaseAmount || "0"}
                            name="sformeditamount"
                            onChange={(e) => {
                              setInput({
                                ...input,
                                refScancentercaseAmount: parseInt(
                                  e.target.value
                                ),
                              });
                            }}
                            required
                            placeholder="Amount"
                            className="w-full text-xs sm:text-sm h-8 sm:h-9"
                            // readOnly={!(role?.type == "admin")}
                          />
                        </div>
                        <div className="w-full flex flex-col gap-1 sm:gap-2">
                          <p className="text-xs sm:text-sm font-bold">
                            Total Amount
                          </p>
                          <Input
                            type="number"
                            value={
                              (input.refScanCenterTotalCase || 0) *
                              (input.refScancentercaseAmount || 0)
                            }
                            name="sformedittotal"
                            required
                            placeholder="Amount"
                            className="w-full text-xs sm:text-sm h-8 sm:h-9"
                            readOnly
                          />
                        </div>
                      </div>
                    </>
                  )}
                  <hr />
                  <div className="flex flex-col gap-4">
                    {otherExpenses.map((expense, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-2 sm:flex-row items-start"
                      >
                        <div className="w-full sm:w-[65%] flex flex-col gap-1 sm:gap-2">
                          <p className="text-xs sm:text-sm font-bold">Other</p>
                          <Textarea
                            value={expense.name}
                            onChange={(e) =>
                              handleChange(index, "name", e.target.value)
                            }
                            placeholder="Other"
                            className="w-full text-xs sm:text-sm h-8 sm:h-9"
                            required
                          />
                        </div>

                        <div className="w-full sm:w-[30%] flex flex-col gap-1 sm:gap-2">
                          <p className="text-xs sm:text-sm font-bold">
                            Total Amount
                          </p>
                          <Input
                            type="number"
                            value={expense.amount}
                            onChange={(e) =>
                              handleChange(
                                index,
                                "amount",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            placeholder="Amount"
                            className="w-full text-xs sm:text-sm h-8 sm:h-9"
                          />
                        </div>

                        {/* Delete button (only show if more than one expense) */}
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => handleDeleteExpense(index)}
                          className="text-xs sm:text-sm mt-7"
                        >
                          <Trash />
                        </Button>
                      </div>
                    ))}

                    {/* Add new expense */}
                    <Button
                      type="button"
                      onClick={handleAddExpense}
                      className="w-fit text-xs sm:text-sm"
                    >
                      <Plus /> Additional amount
                    </Button>
                  </div>
                  <hr />
                  <div className="flex flex-col gap-4">
                    {deductibleExpenses.map((expense, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-2 sm:flex-row items-start"
                      >
                        <div className="w-full sm:w-[65%] flex flex-col gap-1 sm:gap-2">
                          <p className="text-xs sm:text-sm font-bold">Other</p>
                          <Textarea
                            value={expense.name}
                            onChange={(e) =>
                              handleChangeDeductable(
                                index,
                                "name",
                                e.target.value
                              )
                            }
                            placeholder="Other"
                            className="w-full text-xs sm:text-sm h-8 sm:h-9"
                            required
                          />
                        </div>

                        <div className="w-full sm:w-[30%] flex flex-col gap-1 sm:gap-2">
                          <p className="text-xs sm:text-sm font-bold">
                            Total Amount
                          </p>
                          <Input
                            type="number"
                            value={expense.amount}
                            onChange={(e) =>
                              handleChangeDeductable(
                                index,
                                "amount",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            placeholder="Amount"
                            className="w-full text-xs sm:text-sm h-8 sm:h-9"
                          />
                        </div>

                        {/* Delete button (only show if more than one expense) */}
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => handleDeleteExpenseDeductable(index)}
                          className="text-xs sm:text-sm mt-7"
                        >
                          <Trash />
                        </Button>
                      </div>
                    ))}

                    {/* Add new expense */}
                    <Button
                      type="button"
                      onClick={handleAddExpenseDeductable}
                      className="w-fit text-xs sm:text-sm"
                    >
                      <Minus /> Deductible amount
                    </Button>
                  </div>
                </div>
                <div className="py-3 sm:py-4 lg:py-5 px-3 sm:px-4 flex flex-row justify-between sm:justify-end items-center gap-4 sm:gap-6">
                  <div className="text-lg sm:text-xl font-bold">Total</div>
                  <div className="text-lg sm:text-xl font-bold">
                    {input.total}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded mx-auto w-2/3">
              {trimmedDataURL && <img alt="signature" src={trimmedDataURL} />}
            </div>

            {/* Submit Button */}
            <div className="w-full flex justify-center sm:justify-end mt-6 sm:mt-8 lg:mt-10">
              {loading ? (
                <Button
                  type="button"
                  className="bg-[#a3b1a1] hover:bg-[#a3b1a1] text-sm sm:text-base h-9 sm:h-10 px-6 sm:px-8 w-full sm:w-auto max-w-[200px]  min-w-[200px]"
                >
                  <Loader className="animate-spin h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              ) : (
                <div className="space-x-2">
                  <Button
                    type="button"
                    variant="greenTheme"
                    className="text-sm sm:text-base h-9 sm:h-10 px-6 sm:px-8 w-full sm:w-auto max-w-[200px] min-w-[200px]"
                    onClick={() => setDialogOpen(true)}
                  >
                    <span className="hidden sm:inline">Insert Signature</span>
                    <span className="sm:hidden">Insert Signature</span>
                  </Button>

                  <Button
                    type="submit"
                    variant="greenTheme"
                    disabled={input.total <= 0}
                    className="text-sm sm:text-base h-9 sm:h-10 px-6 sm:px-8 w-full sm:w-auto max-w-[200px] min-w-[200px]"
                  >
                    <span className="hidden sm:inline">Generate Invoice</span>
                    <span className="sm:hidden">Generate</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewInvoice;
