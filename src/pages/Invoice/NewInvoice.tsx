import DatePicker from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import LoadingOverlay from "@/components/ui/CustomComponents/loadingOverlay";
import { Input } from "@/components/ui/input";
import logoNew from "../../assets/LogoNew2.png";
import addRadiologist_Bg from "../../assets/Add Admins/Add Radiologist BG.png";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { invoiceServie } from "@/services/invoiceService";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

type Props = {};

const NewInvoice: React.FC<Props> = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const { type, id, date } = location.state || {};

  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState({
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
    quantity: 0,
    amount: 0,
    total: 0,
  });

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
          const { startDate, endDate } = getMonthStartEnd(
            `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
              2,
              "0"
            )}`
          );
          console.log(startDate, endDate);
          if (type === "1") {
            setInput((prev) => ({
              ...prev,
              refSCId: parseInt(id),
              refUserId: 0,
              fromId: 0,
              fromName: "Wellth Green Health Care Pvt. Ltd.",
              toId: res.ScancenterData[0].refSCId,
              toName: res.ScancenterData[0].refSCName,
              toAddress: res.ScancenterData[0].refSCAddress,
              billingfrom: startDate,
              billingto: endDate,
              quantity: res.ScanCenterCount[0].total_appointments,
              amount: res.amount,
              total: res.ScanCenterCount[0].total_appointments * res.amount,
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
              toId: 0,
              toName: "Wellth Green Health Care Pvt. Ltd.",
              billingfrom: startDate,
              billingto: endDate,
              quantity: res.UserCount[0].total_appointments,
              amount: res.amount,
              total: res.UserCount[0].total_appointments * res.amount,
            }));
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });

    setLoading(false);
  }, []);

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
    setLoading(true);
    invoiceServie
      .generateInvoice(input)
      .then((res) => {
        console.log(res);
        if (res.status) {
          toast.success(res.message);
          setTimeout(() => {
            navigate(-1);
          }, 1000);
        } else {
          toast.error(res.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    setLoading(false);
  };

  return (
    <div className="flex w-full flex-col bg-[#edd1ce]  min-h-screen">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitInvoice();
        }}
        className="w-full flex flex-col items-center"
      >
        {loading && <LoadingOverlay />}

        <div
          className="p-2 w-full flex gap-5 items-center bg-[#A3B1A1] lg:bg-[length:70%_100%] lg:bg-no-repeat lg:bg-right-top"
          style={{
            backgroundImage:
              window.innerWidth >= 1024
                ? `url(${addRadiologist_Bg})`
                : undefined,
          }}
        >
          <div className="w-full flex items-center justify-between px-4">
            {/* Logo (Left) */}
            <img
              src={logoNew}
              alt="logoNew"
              className="h-12 sm:h-14 object-contain"
            />

            {/* Title (Center) */}
            <div className="flex-1 text-center">
              <h2 className="text-2xl font-semibold">Invoice</h2>
            </div>

            {/* Spacer to balance alignment (same width as logo) */}
            <div className="w-24" />
          </div>
        </div>

        <div className="w-full px-5 pt-2">
          <Button
            type="button"
            variant="link"
            className="self-start flex text-foreground font-semibold items-center gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft />
            <span className="text-lg font-semibold">Back</span>
          </Button>
        </div>
        <div className="px-10 w-full lg:w-full xxl:w-[70%] pt-2 pb-10 flex flex-col lg:flex-row justify-between">
          <div className="w-[100%] lg:w-[25%] flex flex-col gap-2">
            <p className="text-base font-bold">From</p>
            <Input
              type="text"
              value={input.fromName}
              name="fromName"
              onChange={handleInputChanges}
              required
              placeholder="Name"
              className="w-full text-sm"
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
              className="w-full text-sm"
            />
            <Input
              type="email"
              value={input.fromEmail}
              name="fromEmail"
              onChange={handleInputChanges}
              required
              readOnly={type === "2"}
              placeholder="Email"
              className="w-full text-sm"
            />
            <Input
              type="text"
              value={input.fromPan}
              name="fromPan"
              onChange={handleInputChanges}
              // required
              placeholder="PAN"
              className="w-full text-sm"
            />
            <Input
              type="text"
              value={input.fromGst}
              name="fromGst"
              onChange={handleInputChanges}
              // required
              placeholder="GST"
              className="w-full text-sm"
            />
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
              className="w-full text-sm"
            />
            <p className="text-base font-bold mt-3">To</p>
            <Input
              type="text"
              value={input.toName}
              name="toName"
              onChange={handleInputChanges}
              required
              placeholder="Name"
              className="w-full text-sm"
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
              className="w-full text-sm"
              readOnly={type === "1"}
            />
          </div>
          <div className="w-[100%] lg:w-[25%] mt-4 lg:mt-0 flex flex-col gap-2">
            <p className="text-base font-bold">Billing Period</p>
            <div className="flex flex-col gap-1 items-center">
              <DatePicker
                value={
                  input.billingfrom ? new Date(input.billingfrom) : undefined
                }
                placeholder="From Date"
                disabled
              />
              <p className="text-base font-bold">To</p>
              <DatePicker
                value={input.billingto ? new Date(input.billingto) : undefined}
                placeholder="To Date"
                disabled
              />
            </div>
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
              <SelectTrigger className={`bg-[#fff] font-medium text-sm w-full`}>
                <SelectValue placeholder="Mode of Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key={1} value="UPI">
                  UPI
                </SelectItem>
                <SelectItem key={2} value="BANK TRANSFER">
                  Bank Transfer
                </SelectItem>
              </SelectContent>
            </Select>
            {input.modeofpayment === "UPI" ? (
              <>
                <Input
                  type="text"
                  value={input.upiId}
                  name="upiId"
                  onChange={handleInputChanges}
                  required
                  placeholder="UPI ID"
                  className="w-full text-sm"
                />
              </>
            ) : (
              input.modeofpayment === "BANK TRANSFER" && (
                <>
                  <Input
                    type="text"
                    value={input.accountHolderName}
                    name="accountHolderName"
                    onChange={handleInputChanges}
                    required
                    placeholder="Account Holder Name"
                    className="w-full text-sm"
                  />
                  <Input
                    type="text"
                    value={input.accountNumber}
                    name="accountNumber"
                    onChange={handleInputChanges}
                    required
                    placeholder="Account Number"
                    className="w-full text-sm"
                  />
                  <Input
                    type="text"
                    value={input.bank}
                    name="bank"
                    onChange={handleInputChanges}
                    required
                    placeholder="Bank"
                    className="w-full text-sm"
                  />
                  <Input
                    type="text"
                    value={input.branch}
                    name="branch"
                    onChange={handleInputChanges}
                    required
                    placeholder="Branch"
                    className="w-full text-sm"
                  />
                  <Input
                    type="text"
                    value={input.ifsc}
                    name="ifsc"
                    onChange={handleInputChanges}
                    required
                    placeholder="IFSC"
                    className="w-full text-sm"
                  />
                </>
              )
            )}
          </div>
          <div className="w-[100%] lg:w-[35%] mt-4 lg:mt-0 flex flex-col gap-2">
            <div>
              <p className="text-base font-bold">Invoice Details</p>
              <div className="bg-[#a4b2a1] rounded-sm">
                <div className="bg-[#f8f2ea] rounded-sm gap-4 flex w-full py-4 px-2 items-end">
                  <div className="w-full flex flex-col gap-1">
                    <p className="text-sm font-bold">Quantity</p>
                    <Input
                      type="text"
                      value={input.quantity}
                      name="quantity"
                      onChange={handleInputChanges}
                      required
                      placeholder="Quantity"
                      className="w-full text-sm"
                      readOnly
                    />
                  </div>
                  <div className="w-full flex flex-col gap-1">
                    <p className="text-sm font-bold">Amount (INR)</p>
                    <Input
                      type="text"
                      value={input.amount}
                      name="amount"
                      onChange={handleInputChanges}
                      required
                      placeholder="Amount"
                      className="w-full text-sm"
                      readOnly
                    />
                  </div>
                </div>
                <div className="py-5 px-4 flex flex-row justify-end items-center gap-6">
                  <div className="text-xl font-bold">Total</div>
                  <div className="text-xl font-bold">{input.total}/-</div>
                </div>
              </div>
            </div>
            <div className="px-10 w-full flex justify-end mb-10 lg:mb-0 mt-10">
              <Button
                type="submit"
                className="bg-[#a3b1a1] hover:bg-[#a3b1a1] text-base"
              >
                Generate Report
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewInvoice;
