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
import InvoiceOverAllTable from "./InvoiceOverAllTable";

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
  const [overallInvoiceHistory, setOverallInvoiceHistory] = useState<
    InvoiceHistory[]
  >([]);

  useEffect(() => {
    setLoading(true);

    console.log(role?.id);

    if (role?.id === 6 || role?.id === 7 || role?.id === 10) {
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
      if(role?.id === 9){
         setType("2");
      }
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

    invoiceServie.getOverallInvoiceHistory().then((res) => {
      console.log(res);
      if (res.status) {
        setOverallInvoiceHistory(res.invoiceHistory);
        console.log(res);
      }
    });

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
      className="h-[90vh] w-[95vw] sm:w-[90vw] lg:w-[90vw] overflow-y-auto p-0"
    >
      {loading && <LoadingOverlay />}
      <div className="w-full">
        {/* Header */}
        <div className="h-[12vh] sm:h-[15vh] bg-[#efd4d1] flex items-center justify-between px-3 sm:px-4 lg:px-6">
          {/* Logo (Left) */}
          <img
            src={logoNew}
            alt="logoNew"
            className="h-8 sm:h-10 lg:h-12 xl:h-14 object-contain"
          />

          {/* Title (Center) */}
          <div className="flex-1 text-center">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold">
              Invoice
            </h2>
          </div>

          {/* Spacer to balance alignment */}
          <div className="w-16 sm:w-20 lg:w-24" />
        </div>

        {/* Type Selection Tabs */}
        <div className="flex items-center justify-center px-4 sm:px-6 lg:px-10 py-3 sm:py-4 lg:py-5">
          {(role?.id === 1 || role?.id === 9) && (
            <div className="flex gap-2 sm:gap-3 lg:gap-4 flex-wrap justify-center">
              {role.id === 1 && (
                <div
                  onClick={() => {
                    setType("1");
                    setDate(null);
                    setSelectedScanCenter(null);
                    setSelectedUser(null);
                    setInvoiceHistory([]);
                  }}
                  className={`text-xs sm:text-sm w-[80px] sm:w-[120px] lg:w-[160px] text-center h-10 font-bold flex justify-center items-center px-1 sm:px-2 rounded-sm cursor-pointer transition-colors ${
                    type === "1"
                      ? "bg-[#a3b1a0] text-white"
                      : "bg-[#f6ede7] border-2 border-[#a3b1a0]"
                  }`}
                >
                  Scan Center
                </div>
              )}
              <div
                onClick={() => {
                  setType("2");
                  setDate(null);
                  setSelectedScanCenter(null);
                  setSelectedUser(null);
                  setInvoiceHistory([]);
                }}
                className={`text-xs sm:text-sm w-[80px] sm:w-[120px] lg:w-[160px] text-center h-10 font-bold flex justify-center items-center px-1 sm:px-2 rounded-sm cursor-pointer transition-colors ${
                  type === "2"
                    ? "bg-[#a3b1a0] text-white"
                    : "bg-[#f6ede7] border-2 border-[#a3b1a0]"
                }`}
              >
                User
              </div>
              {role.id === 1 && (
                <div
                  onClick={() => {
                    setType("3");
                    setDate(null);
                    setSelectedScanCenter(null);
                    setSelectedUser(null);
                    setInvoiceHistory([]);
                  }}
                  className={`text-xs sm:text-sm w-[80px] sm:w-[120px] lg:w-[160px] text-center h-10 font-bold flex justify-center items-center px-1 sm:px-2 rounded-sm cursor-pointer transition-colors ${
                    type === "3"
                      ? "bg-[#a3b1a0] text-white"
                      : "bg-[#f6ede7] border-2 border-[#a3b1a0]"
                  }`}
                >
                  Edit Amount
                </div>
              )}
              <div
                onClick={() => {
                  setType("4");
                  setDate(null);
                  setSelectedScanCenter(null);
                  setSelectedUser(null);
                  setInvoiceHistory([]);
                }}
                className={`text-xs sm:text-sm w-[80px] sm:w-[160px] lg:w-[200px] text-center h-10 font-bold flex justify-center items-center px-1 sm:px-2 rounded-sm cursor-pointer transition-colors ${
                  type === "4"
                    ? "bg-[#a3b1a0] text-white"
                    : "bg-[#f6ede7] border-2 border-[#a3b1a0]"
                }`}
              >
                Over All Invoice
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        {(type === "2" || type === "1") && (
          <div className="w-full flex flex-col lg:flex-row my-3 sm:my-5">
            {/* Left Panel - Controls */}
            <div className="w-full lg:w-[50%] flex flex-col gap-3 sm:gap-4 justify-start px-4 sm:px-6 lg:px-10 mb-4 lg:mb-0">
              {type === "1" && (
                <>
                  <div className="w-full">
                    <Select
                      value={selectedScanCenter || ""}
                      onValueChange={(val) => {
                        setSelectedScanCenter(val);
                        getUserInvoiceHistory(parseInt(type), parseInt(val));
                        setDate(null);
                      }}
                    >
                      <SelectTrigger className="bg-[#a3b1a0] font-medium p-2 text-xs sm:text-sm w-full h-9 sm:h-10">
                        <SelectValue placeholder="Choose Scan Center" />
                      </SelectTrigger>
                      <SelectContent>
                        {scancenterList.map((item, index) => (
                          <SelectItem
                            key={index}
                            value={item.refSCId.toString()}
                            className="text-xs sm:text-sm"
                          >
                            {item.refSCCustId}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-start sm:justify-end">
                    {selectedScanCenter && (
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full sm:w-auto">
                        {(role?.id === 9 ||
                          role?.id === 1 ||
                          role?.id === 6 ||
                          role?.id === 7) && (
                          <>
                            <div className="w-full sm:w-auto">
                              <PopoverDialog>
                                <PopoverTriggerDialog asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "h-8 sm:h-9 px-3 sm:px-6 w-full sm:w-auto text-xs sm:text-sm justify-start text-left font-medium",
                                      !date && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-1 sm:mr-2 h-4 sm:h-5 w-4 sm:w-5" />
                                    {date ? (
                                      format(date, "MMM yyyy")
                                    ) : (
                                      <>
                                        {" "}
                                        <span className="hidden sm:inline">
                                          Pick a month
                                        </span>
                                        <span className="sm:hidden">Month</span>
                                      </>
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
                              disabled={!date}
                              className="bg-[#a3b1a0] hover:bg-[#a3b1a0] text-xs sm:text-sm h-8 sm:h-9 w-full sm:w-auto px-3 sm:px-4"
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
                              <span className="hidden sm:inline">
                                Create Invoice
                              </span>
                              <span className="sm:hidden">Create</span>
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}

              {type === "2" && (
                <>
                  <div className="w-full">
                    <Select
                      value={selectedUser || ""}
                      onValueChange={(val) => {
                        setSelectedUser(val);
                        getUserInvoiceHistory(parseInt(type), parseInt(val));
                        setDate(null);
                      }}
                    >
                      <SelectTrigger className="bg-[#a3b1a0] font-medium p-2 text-xs sm:text-sm w-full h-9 sm:h-10">
                        <SelectValue placeholder="Choose User" />
                      </SelectTrigger>
                      <SelectContent>
                        {UserList.map((item, index) => (
                          <SelectItem
                            key={index}
                            value={item.refUserId.toString()}
                            className="text-xs sm:text-sm"
                          >
                            {item.refUserCustId}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-start sm:justify-end">
                    {selectedUser && (
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full sm:w-auto">
                        {(role?.id === 9 ||
                          role?.id === 1 ||
                          role?.id === 6 ||
                          role?.id === 7 ||
                          role?.id === 10) && (
                          <>
                            <div className="w-full m:w-auto">
                              <PopoverDialog>
                                <PopoverTriggerDialog asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "h-8 sm:h-9 px-3 sm:px-6 w-full sm:w-auto text-xs sm:text-sm justify-start text-left font-medium",
                                      !date && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-1 sm:mr-2 h-4 sm:h-5 w-4 sm:w-5" />
                                    {date ? (
                                      format(date, "MMM yyyy")
                                    ) : (
                                      <>
                                        <span className="hidden sm:inline">
                                          Pick a month
                                        </span>
                                        <span className="sm:hidden">Month</span>
                                      </>
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
                              disabled={!date}
                              className="bg-[#a3b1a0] hover:bg-[#a3b1a0] text-xs sm:text-sm h-8 sm:h-9 w-full sm:w-auto px-3 sm:px-4"
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
                              <span className="hidden sm:inline">
                                Create Invoice
                              </span>
                              <span className="sm:hidden">Create</span>
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Right Panel - Invoice History */}
            <div className="w-full lg:w-[50%] flex flex-col gap-3 sm:gap-5 h-[30vh] sm:h-[35vh] lg:h-[40vh] overflow-y-auto px-4 sm:px-6 lg:px-10">
              {(type === "1" || type === "2") && (
                <div className="flex flex-col gap-3 sm:gap-4 justify-start items-start w-full">
                  <h3 className="font-bold text-sm sm:text-base lg:hidden">
                    Invoice History
                  </h3>
                  {invoiceHistory && invoiceHistory.length > 0 ? (
                    invoiceHistory.map((item, index) => (
                      <div
                        key={index}
                        className="bg-[#fff] w-full px-3 sm:px-4 lg:px-5 py-2 sm:py-3 rounded-sm border-2 border-[#a3b1a0] flex justify-between items-center"
                      >
                        <div className="font-bold text-xs sm:text-sm">
                          {item.refIHFromDate.slice(0, 7)}
                        </div>
                        <div>
                          <InvoiceDownloadButton invoiceHistory={item} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs sm:text-sm font-bold text-center w-full py-4">
                      No Invoice Found
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Amount Edit Form */}
        {type === "3" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateAmount();
            }}
            className="px-4 sm:px-6 lg:px-10"
          >
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 lg:gap-10 mt-4">
              <div className="flex flex-col items-start gap-2 sm:gap-3 w-full sm:w-auto">
                <p className="font-bold text-sm sm:text-base">
                  Scan Center Amount (INR)
                </p>
                <Input
                  type="number"
                  value={amount.scanCenterAmount}
                  onChange={(e) =>
                    setAmount((prev) => ({
                      ...prev,
                      scanCenterAmount: parseInt(e.target.value) || 0,
                    }))
                  }
                  required
                  placeholder="Amount"
                  className="w-full sm:w-[200px] lg:w-[250px] text-xs sm:text-sm h-9 sm:h-10"
                />
              </div>
              <div className="flex flex-col items-start gap-2 sm:gap-3 w-full sm:w-auto">
                <p className="font-bold text-sm sm:text-base">
                  User Amount (INR)
                </p>
                <Input
                  type="number"
                  value={amount.userAmount}
                  onChange={(e) =>
                    setAmount((prev) => ({
                      ...prev,
                      userAmount: parseInt(e.target.value) || 0,
                    }))
                  }
                  required
                  placeholder="Amount"
                  className="w-full sm:w-[200px] lg:w-[250px] text-xs sm:text-sm h-9 sm:h-10"
                />
              </div>
            </div>
            <div className="flex justify-start mt-4 sm:mt-6">
              <Button
                type="submit"
                className="bg-[#a3b1a0] hover:bg-[#a3b1a0] text-xs sm:text-sm h-8 sm:h-9 px-4 sm:px-6"
              >
                Save
              </Button>
            </div>
          </form>
        )}

        {/* OverAll Invoice Table */}
        {type === "4" && (
          <>
            <InvoiceOverAllTable
              overallInvoiceHistory={overallInvoiceHistory}
              setLoading={setLoading}
            />
          </>
        )}
      </div>
    </DialogContent>
  );
};

export default InvoicePopUp;
