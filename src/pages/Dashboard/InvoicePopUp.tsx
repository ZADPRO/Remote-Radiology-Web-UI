import { DialogContent } from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import logoNew from "../../assets/LogoNew.png";
import LoadingOverlay from "@/components/ui/CustomComponents/loadingOverlay";
import { useAuth } from "../Routes/AuthContext";

type Props = {};

const InvoicePopUp: React.FC<Props> = () => {
  // const [_, setType] = useState("1");
  // const [_, setSelectedUser] = useState<string | null>(null);
  // const [_, setSelectedScanCenter] = useState<string | null>(
  //   null
  // );

  // const [_, setInvoiceHistory] = useState<InvoiceHistory[]>([]);

  // const [strickedDates, setStrickedDates] = useState<Date[]>([]);

  // const navigate = useNavigate();

  // const [date, setDate] = React.useState<Date | null>(null);

  // const [amount, setAmount] = useState({
  //   scanCenterAmount: 0,
  //   userAmount: 0,
  // });

  // const [scancenterList, setScanCenterList] = useState<scancenterData[]>([]);
  // const [UserList, setUserList] = useState<userData[]>([]);

  const [loading, setLoading] = useState(false);

  const { role } = useAuth();
  // const [overallInvoiceHistory, setOverallInvoiceHistory] = useState<
  //   InvoiceHistory[]
  // >([]);

  useEffect(() => {
    setLoading(true);

    console.log(role?.id);

    // if (role?.id === 6 || role?.id === 7 || role?.id === 10) {
    //   setType("2");
    //   setSelectedUser(user?.refUserId?.toString() || "");
    //   setUserList([
    //     {
    //       refUserId: user?.refUserId ?? 0,
    //       refUserCustId: user?.refUserCustId ?? "",
    //     },
    //   ]);
    //   getUserInvoiceHistory(2, user?.refUserId ?? 0);
    // } else if (role?.id === 3) {
    //   setType("1");
    //   setSelectedUser(user?.refUserId?.toString() || "");
    //   setSelectedScanCenter(user?.refSCId?.toString() || "");
    //   invoiceServie
    //     .getAmount()
    //     .then((res) => {
    //       console.log(res);
    //       if (res.status) {
    //         const matchedSC = res.scancenterData.find(
    //           (item) => item.refSCId === (user?.refSCId ?? 0)
    //         );

    //         if (matchedSC) {
    //           setScanCenterList([
    //             {
    //               refSCId: matchedSC.refSCId,
    //               refSCCustId: matchedSC.refSCCustId,
    //               refSCName: matchedSC.refSCName,
    //               refSCAddress: matchedSC.refSCAddress,
    //             },
    //           ]);
    //         }
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    //   getUserInvoiceHistory(1, user?.refSCId ?? 0);
    // } else {
    //   if(role?.id === 9){
    //      setType("2");
    //   }
    //   invoiceServie
    //     .getAmount()
    //     .then((res) => {
    //       console.log(res);
    //       if (res.status) {
    //         setAmount({
    //           scanCenterAmount: res.ScancenterAmount,
    //           userAmount: res.UserAmount,
    //         });
    //         setScanCenterList(res.scancenterData);
    //         setUserList(res.userData);
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // }

    // invoiceServie.getOverallInvoiceHistory().then((res) => {
    //   console.log(res);
    //   if (res.status) {
    //     setOverallInvoiceHistory(res.invoiceHistory);
    //     console.log(res);
    //   }
    // });

    setLoading(false);
  }, []);

  // const handleUpdateAmount = () => {
  //   setLoading(true);
  //   invoiceServie
  //     .updateAmount(amount.scanCenterAmount, amount.userAmount)
  //     .then((res) => {
  //       console.log(res);
  //       if (res.status) {
  //         toast.success(res.message);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  //   setLoading(false);
  // };

  // const getUserInvoiceHistory = (type: number, id: number) => {
  //   setLoading(true);
  //   invoiceServie
  //     .getInvoiceHistory(type, id)
  //     .then((res) => {
  //       console.log(res);
  //       if (res.status) {
  //         if (res.invoiceHistoryTakenDate !== null) {
  //           setStrickedDates(
  //             res.invoiceHistoryTakenDate.map(
  //               (item) => new Date(item.refIHFromDate)
  //             )
  //           );
  //         } else {
  //           setStrickedDates([]);
  //         }
  //         setInvoiceHistory(res.invoiceHistory);
  //         // toast.success(res.message);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  //   setLoading(false);
  // };

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
         
           In Progress
        </div>

      </div>
    </DialogContent>
  );
};

export default InvoicePopUp;
