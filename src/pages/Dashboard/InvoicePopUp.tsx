import { DialogContent } from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import logoNew from "../../assets/LogoNew2.png";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { MonthPicker } from "@/components/ui/monthpicker";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  PopoverContentDialog,
  PopoverDialog,
  PopoverTriggerDialog,
} from "@/components/ui/CustomComponents/popoverdialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import LoadingOverlay from "@/components/ui/CustomComponents/loadingOverlay";
import {
  InvoiceHistory,
  invoiceServie,
  scancenterData,
  userData,
} from "@/services/invoiceService";
import InvoiceDownloadButton from "../Invoice/InvoiceDownloadButton";
import { useAuth } from "../Routes/AuthContext";

type Props = {};

const InvoicePopUp: React.FC<Props> = () => {
  const [type, setType] = useState("1");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedScanCenter, setSelectedScanCenter] = useState<string | null>(
    null
  );

  const [invoiceHistory, setInvoiceHistory] = useState<InvoiceHistory[]>([]);

  const [strickedDates, setStrickedDates] = useState<Date[]>([]);

  const navigate = useNavigate();

  const [date, setDate] = React.useState<Date | null>(null);

  const [amount, setAmount] = useState({
    scanCenterAmount: 0,
    userAmount: 0,
  });

  const [scancenterList, setScanCenterList] = useState<scancenterData[]>([]);
  const [UserList, setUserList] = useState<userData[]>([]);

  const [loading, setLoading] = useState(false);

  const { user, role } = useAuth();

  useEffect(() => {
    setLoading(true);

    console.log(role?.id);

    if (role?.id === 6 || role?.id === 7) {
      setType("2");
      setSelectedUser(user?.refUserId?.toString() || "");
      setUserList([
        {
          refUserId: user?.refUserId ?? 0,
          refUserCustId: user?.refUserCustId ?? "",
        },
      ]);
      getUserInvoiceHistory(2, user?.refUserId ?? 0);
    } else if (role?.id === 3) {
      setType("1");
      setSelectedUser(user?.refUserId?.toString() || "");
      setSelectedScanCenter(user?.refSCId?.toString() || "");
      invoiceServie
        .getAmount()
        .then((res) => {
          console.log(res);
          if (res.status) {
            const matchedSC = res.scancenterData.find(
              (item) => item.refSCId === (user?.refSCId ?? 0)
            );

            if (matchedSC) {
              setScanCenterList([
                {
                  refSCId: matchedSC.refSCId,
                  refSCCustId: matchedSC.refSCCustId,
                  refSCName: matchedSC.refSCName,
                  refSCAddress: matchedSC.refSCAddress,
                },
              ]);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
      getUserInvoiceHistory(1, user?.refSCId ?? 0);
    } else {
      invoiceServie
        .getAmount()
        .then((res) => {
          console.log(res);
          if (res.status) {
            setAmount({
              scanCenterAmount: res.ScancenterAmount,
              userAmount: res.UserAmount,
            });
            setScanCenterList(res.scancenterData);
            setUserList(res.userData);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }

    setLoading(false);
  }, []);

  const handleUpdateAmount = () => {
    setLoading(true);
    invoiceServie
      .updateAmount(amount.scanCenterAmount, amount.userAmount)
      .then((res) => {
        console.log(res);
        if (res.status) {
          toast.success(res.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  const getUserInvoiceHistory = (type: number, id: number) => {
    setLoading(true);
    invoiceServie
      .getInvoiceHistory(type, id)
      .then((res) => {
        console.log(res);
        if (res.status) {
          if (res.invoiceHistoryTakenDate !== null) {
            setStrickedDates(
              res.invoiceHistoryTakenDate.map(
                (item) => new Date(item.refIHFromDate)
              )
            );
          } else {
            setStrickedDates([]);
          }
          setInvoiceHistory(res.invoiceHistory);
          // toast.success(res.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  return (
    <DialogContent
      style={{
        background:
          "radial-gradient(100.97% 186.01% at 50.94% 50%, #F9F4EC 25.14%, #EED8D6 100%)",
      }}
      className="h-[90vh] w-[90vw] lg:w-[70vw] overflow-y-auto p-0"
    >
      {loading && <LoadingOverlay />}
      <div className="w-full">
        <div className="h-[15vh] bg-[#efd4d1] flex items-center justify-between px-4">
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
        <div className="flex items-center justify-center px-10 py-5">
          {(role?.id === 1 || role?.id === 9) && (
            <div className="flex gap-4">
              <div
                onClick={() => {
                  setType("1");
                  setDate(null);
                  setSelectedScanCenter(null);
                  setSelectedUser(null);
                  setInvoiceHistory([]);
                }}
                className={`text-sm w-[100px] h-14 font-bold flex justify-center items-center px-2 rounded-sm cursor-pointer ${
                  type === "1"
                    ? "bg-[#a3b1a0]"
                    : "bg-[#f6ede7] border-2 border-[#a3b1a0]"
                }`}
              >
                Scan Center
              </div>
              <div
                onClick={() => {
                  setType("2");
                  setDate(null);
                  setSelectedScanCenter(null);
                  setSelectedUser(null);
                  setInvoiceHistory([]);
                }}
                className={`text-sm w-[100px] font-bold flex justify-center items-center px-2 rounded-sm cursor-pointer ${
                  type === "2"
                    ? "bg-[#a3b1a0]"
                    : "bg-[#f6ede7] border-2 border-[#a3b1a0]"
                }`}
              >
                User
              </div>
              <div
                onClick={() => {
                  setType("3");
                  setDate(null);
                  setSelectedScanCenter(null);
                  setSelectedUser(null);
                  setInvoiceHistory([]);
                }}
                className={`text-sm w-[100px] font-bold flex justify-center items-center px-2 rounded-sm cursor-pointer ${
                  type === "3"
                    ? "bg-[#a3b1a0]"
                    : "bg-[#f6ede7] border-2 border-[#a3b1a0]"
                }`}
              >
                Edit Amount
              </div>
            </div>
          )}
        </div>
        {
          (type === "2" || type === "1") && (
            <div className="w-full flex flex-row my-5">
          <div className="w-[50%] flex flex-col gap-4 justify-start px-10">
            {type === "1" && (
              <>
                <div>
                  <Select
                    value={selectedScanCenter || ""}
                    onValueChange={(val) => {
                      setSelectedScanCenter(val);
                      getUserInvoiceHistory(parseInt(type), parseInt(val));
                      setDate(null);
                    }}
                  >
                    <SelectTrigger
                      className={`bg-[#a3b1a0] font-medium p-2 text-sm w-full`}
                    >
                      <SelectValue placeholder="Choose Scan Center" />
                    </SelectTrigger>
                    <SelectContent>
                      {scancenterList.map((item, index) => (
                        <SelectItem key={index} value={item.refSCId.toString()}>
                          {item.refSCCustId}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-3 justify-end">
                  {selectedScanCenter && (
                    <>
                      <div className="flex gap-5">
                        {(role?.id === 9 ||
                          role?.id === 1 ||
                          role?.id === 6 ||
                          role?.id === 7) && (
                          <>
                            <div>
                              <PopoverDialog>
                                <PopoverTriggerDialog asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "h-9 px-6 w-full text-sm justify-start text-left font-medium", // ⬅️ size boost
                                      !date && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-5 w-5" />{" "}
                                    {/* ⬅️ Slightly bigger icon */}
                                    {date ? (
                                      format(date, "MMM yyyy")
                                    ) : (
                                      <span>Pick a month</span>
                                    )}
                                  </Button>
                                </PopoverTriggerDialog>
                                <PopoverContentDialog className="w-auto p-0">
                                  <MonthPicker
                                    className="w-full"
                                    disabledDates={strickedDates}
                                    maxDate={
                                      new Date(
                                        new Date().getFullYear(),
                                        new Date().getMonth() - 1,
                                        1
                                      )
                                    }
                                    onMonthSelect={setDate}
                                    selectedMonth={date ?? undefined}
                                  />
                                </PopoverContentDialog>
                              </PopoverDialog>
                            </div>
                            <Button
                              disabled={date ? false : true}
                              className="bg-[#a3b1a0] hover:bg-[#a3b1a0] text-sm"
                              onClick={() => {
                                navigate("/invoicegenerate", {
                                  state: {
                                    type: type,
                                    id: selectedScanCenter,
                                    date: date,
                                  },
                                });
                              }}
                            >
                              Create Report
                            </Button>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

            {type === "2" && (
              <>
                <div>
                  <Select
                    value={selectedUser || ""}
                    onValueChange={(val) => {
                      setSelectedUser(val);
                      getUserInvoiceHistory(parseInt(type), parseInt(val));
                      setDate(null);
                    }}
                  >
                    <SelectTrigger
                      className={`bg-[#a3b1a0] font-medium p-2 text-sm w-full`}
                    >
                      <SelectValue placeholder="Choose User" />
                    </SelectTrigger>
                    <SelectContent>
                      {UserList.map((item, index) => (
                        <SelectItem
                          key={index}
                          value={item.refUserId.toString()}
                        >
                          {item.refUserCustId}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-3 justify-end">
                  {selectedUser && (
                    <>
                      <div className="flex gap-5">
                        {(role?.id === 9 ||
                          role?.id === 1 ||
                          role?.id === 6 ||
                          role?.id === 7) && (
                          <>
                            <div>
                              <PopoverDialog>
                                <PopoverTriggerDialog asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "h-9 px-6 text-sm justify-start text-left font-medium", // ⬅️ size boost
                                      !date && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-5 w-5" />{" "}
                                    {/* ⬅️ Slightly bigger icon */}
                                    {date ? (
                                      format(date, "MMM yyyy")
                                    ) : (
                                      <span>Pick a month</span>
                                    )}
                                  </Button>
                                </PopoverTriggerDialog>
                                <PopoverContentDialog className="w-auto p-0">
                                  <MonthPicker
                                    className="z-50"
                                    disabledDates={strickedDates}
                                    maxDate={
                                      new Date(
                                        new Date().getFullYear(),
                                        new Date().getMonth() - 1,
                                        1
                                      )
                                    }
                                    onMonthSelect={setDate}
                                    selectedMonth={date ?? undefined}
                                  />
                                </PopoverContentDialog>
                              </PopoverDialog>
                            </div>
                            <Button
                              disabled={date ? false : true}
                              className="bg-[#a3b1a0] hover:bg-[#a3b1a0] text-sm"
                              onClick={() => {
                                navigate("/invoicegenerate", {
                                  state: {
                                    type: type,
                                    id: selectedUser,
                                    date: date,
                                  },
                                });
                              }}
                            >
                              Create Report
                            </Button>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="w-[50%] flex flex-col gap-5 h-[40vh] overflow-y-auto ">
            {(type === "1" || type === "2") && (
              <div className="px-10 flex flex-col gap-4 justify-start items-start w-full">
                {invoiceHistory ? (
                  invoiceHistory.map((item) => (
                    <div className="bg-[#fff] w-full px-5 py-2 rounded-sm border-2 border-[#a3b1a0] flex justify-between items-center">
                      <div className="font-bold text-sm">
                        {item.refIHFromDate.slice(0, 7)}
                      </div>
                      <div>
                        {/* <Download /> */}
                        <InvoiceDownloadButton invoiceHistory={item} />
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <p className="text-sm font-bold">No Invoice Found</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
          )
        }
        {type === "3" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateAmount();
            }}
          >
            <div className="flex gap-10 mt-4 px-10">
              <div className="flex flex-col items-start gap-3">
                <p className="font-bold text-base">Scan Center Amount (INR)</p>
                <Input
                  type="number"
                  value={amount.scanCenterAmount}
                  onChange={(e) =>
                    setAmount((prev) => ({
                      ...prev,
                      scanCenterAmount: parseInt(e.target.value),
                    }))
                  }
                  required
                  placeholder="Amount"
                  className="w-full text-sm"
                />
              </div>
              <div className="flex flex-col items-start gap-3">
                <p className="font-bold text-base">User Amount (INR)</p>
                <Input
                  type="number"
                  value={amount.userAmount}
                  onChange={(e) =>
                    setAmount((prev) => ({
                      ...prev,
                      userAmount: parseInt(e.target.value),
                    }))
                  }
                  required
                  placeholder="Amount"
                  className="w-full text-sm"
                />
              </div>
            </div>
            <div className="flex justify-start mt-6  px-10">
              <Button
                type="submit"
                className="bg-[#a3b1a0] hover:bg-[#a3b1a0] text-sm"
              >
                Save
              </Button>
            </div>
          </form>
        )}
        
      </div>
    </DialogContent>
  );
};

export default InvoicePopUp;
