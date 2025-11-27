import React, { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { TotalAppointmentCase } from "./TotalAppointmentCase";
import { ScanIndicationsPie } from "./ScanIndicationsPie";
import { RecoCodeCountPie } from "./RecoCodeCountPie";
import {
  analyticsService,
  AppointmentCases,
  IntakeFormAnalytics,
  ListScanAppointmentCount,
  OverAllAnalytics,
  OverAllScanCenterAnalytics,
  RecommentdationPieModel,
  TATStats,
  TotalArtifacts,
  TotalCorrectEdit,
  UserAccessTiming,
  UserList,
} from "@/services/analyticsService";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { RoleList, useAuth, UserRole } from "../Routes/AuthContext";
import { ListScanCenter } from "@/services/scancenterService";
import { TATPieChart } from "./TATPieChart";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/calendar";
import { ChevronDown, User } from "lucide-react";
import { ArtifactsPie } from "./ArtifactsPieChart";
import OverAllAnalyticsTable from "./UsersOverAllAnalyticsTable";
import ScanCenterOverAllAnalyticsTable from "./ScanCenterOverAllAnalaytics";
import LoadingOverlay from "@/components/ui/CustomComponents/loadingOverlay";

const Analytics: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  const [open, setOpen] = React.useState(false);

  const handleSelect = (range: DateRange | undefined) => {
    if (range) {
      console.log(range);
      setDateRange(range);
    }
  };

  const [loading, setLoding] = useState(false);

  const { user, role } = useAuth();

  const [centerSelectedValue, setCenterSelectedValue] = useState<number | null>(
    role?.type === "scadmin" && user?.refSCId ? user.refSCId : 0
  );

  const [userSelectedValue, setUserSelectedValue] = useState<number | null>(
    role?.type === "scadmin" ? 0 : null
  );

  const [appointmentCase, setAppointmentCase] = useState<AppointmentCases[]>(
    []
  );
  const [intakeFormAnalytics, setIntakeFormAnalytics] = useState<
    IntakeFormAnalytics[]
  >([]);
  const [allScanCenters, setAllScanCenters] = useState<ListScanCenter[]>([]);
  const [allUsers, setAllUsers] = useState<UserList[]>();

  const [listScanAppointmentCount, setListScanAppointmentCount] = useState<
    ListScanAppointmentCount[]
  >([]);
  const [userAccessTiming, setUserAccessTiming] = useState<UserAccessTiming[]>(
    []
  );
  const [recoCodeLeft, setRecodeLeft] = useState<RecommentdationPieModel>({
    Annualscreening: 0,
    Biopsy: 0,
    Breastradiologist: 0,
    ClinicalCorrelation: 0,
    OncoConsult: 0,
    Redo: 0,
    USGSFU: 0,
  });

  const [recoCodeRight, setRecodeRight] = useState<RecommentdationPieModel>({
    Annualscreening: 0,
    Biopsy: 0,
    Breastradiologist: 0,
    ClinicalCorrelation: 0,
    OncoConsult: 0,
    Redo: 0,
    USGSFU: 0,
  });

  const [totalCorrectEdits, setTotalCorrectEdits] = useState<
    TotalCorrectEdit[]
  >([]);
  const [tatStats, setTatStats] = useState<TATStats[]>([]);

  const [techArtifacts, setTechArtifacts] = useState<TotalArtifacts[]>([]);

  const [reportArtifacts, setReportArtifacts] = useState<TotalArtifacts[]>([]);

  const [UsersOverAllAnalaytics, setUserOverAllAnalaytics] = useState<
    OverAllAnalytics[]
  >([]);

  const [ScanCenterOverAllAnalaytics, setScanCenterOverAllAnalaytics] =
    useState<OverAllScanCenterAnalytics[]>([]);

  const [tempRole, setTempRole] = useState({
    id: 0,
    type: "",
  });

  type AccessKey =
    | "userselect"
    | "scancenterselect"
    | "totalCorrect"
    | "recoCodeCount"
    | "totalEdit"
    | "TAT"
    | "totalCaseCountPopover"
    | "previousMonth"
    | "scanIndications"
    | "turnaroundTime"
    | "techArtifact"
    | "reportArtifact";

  const accessMap: Record<AccessKey, UserRole[]> = {
    userselect: ["admin", "manager", "scadmin"],
    scancenterselect: ["admin", "manager"],
    totalCorrect: ["admin", "radiologist", "wgdoctor", "codoctor"],
    totalEdit: ["admin", "radiologist", "wgdoctor", "codoctor"],
    recoCodeCount: ["admin", "manager", "wgdoctor", "scadmin", "radiologist"],
    TAT: [
      // "admin",
      // "radiologist",
      // "technician",
      // "codoctor",
      // "doctor",
      // "wgdoctor",
    ],
    totalCaseCountPopover: ["radiologist"],
    previousMonth: [
      "admin",
      "manager",
      "scadmin",
      "radiologist",
      "technician",
      "wgdoctor",
      "scribe",
      "codoctor",
      "doctor",
    ],
    scanIndications: ["admin", "manager", "scadmin", "technician", "wgdoctor", "radiologist"],
    turnaroundTime: [
      "admin",
      "radiologist",
      "technician",
      "codoctor",
      "doctor",
      "wgdoctor",
    ],
    techArtifact: [
      "admin",
      "manager",
      "wgdoctor",
      "scadmin",
      "technician",
      "codoctor",
      "radiologist",
    ],
    reportArtifact: [
      "admin",
      "manager",
      "wgdoctor",
      "scadmin",
      "technician",
      "codoctor",
      "radiologist",
    ],
  } as const;

  const handleComponentAccess = (accessString: AccessKey): boolean => {
    if (user?.refUserId == null || role?.id == null) return false;

    const allowedRoles = accessMap[accessString];

    // ✅ For 'userselect' and 'scancenterselect', check only current role (inverted logic preserved)
    if (["userselect", "scancenterselect"].includes(accessString)) {
      return !allowedRoles.includes(role.type);
    }

    // ✅ If admin/manager and a user is selected, check ONLY tempRole
    if (
      ["admin", "manager", "scadmin"].includes(role.type) &&
      userSelectedValue
    ) {
      const tempRoleType = tempRole?.type as UserRole | undefined;

      // If tempRole exists, base access ONLY on it
      if (tempRoleType) {
        return !allowedRoles.includes(tempRoleType);
      }

      // Fallback: If no tempRole, fall back to checking current role
      return !allowedRoles.includes(role.type);
    }

    // ✅ Default: check current role
    return !allowedRoles.includes(role.type);
  };

  const getCount = (array: any, groupName: string) => {
    if (array) {
      const item = array.find((i: any) => i.group_name === groupName);
      console.log('Analytics.tsx -------------------------- >  227  ',groupName,item);
      return item ? parseInt(item.total_count) : 0;
      
    } else {
      return 0;
    }
  };

  const fetchOverallScanCenter = async (scId: number) => {
    try {
      
      if (!dateRange.from || !dateRange.to) {
        console.error("Date range is incomplete.");
        return;
      }

      setLoding(true);

      const res = await analyticsService.overallScanCenter(
        scId,
        format(dateRange.from, "yyyy-MM-dd"),
        format(dateRange.to, "yyyy-MM-dd")
      );

      if (res.status) {
        setScanCenterOverAllAnalaytics(res.OverAllAnalytics || []);
        setAppointmentCase(res.AdminOverallAnalaytics || []);
        setAllScanCenters(res.AllScaCenter || []);
        setAllUsers(res.UserListIds || []);
        setIntakeFormAnalytics(res.AdminOverallScanIndicatesAnalaytics || []);
        setRecodeLeft({
          Annualscreening: getCount(res.LeftRecommendation, "Annual Screening"),
          Biopsy: getCount(res.LeftRecommendation, "Biopsy"),
          Breastradiologist: getCount(
            res.LeftRecommendation,
            "Breast Radiologist"
          ),
          ClinicalCorrelation: getCount(
            res.LeftRecommendation,
            "Clinical Correlation"
          ),
          OncoConsult: getCount(res.LeftRecommendation, "Onco Consult"),
          Redo: getCount(res.LeftRecommendation, "Redo"),
          USGSFU: getCount(res.LeftRecommendation, "USG/SFU"), // note exact name in your array
        });

        setRecodeRight({
          Annualscreening: getCount(
            res.RightRecommendation,
            "Annual Screening"
          ),
          Biopsy: getCount(res.RightRecommendation, "Biopsy"),
          Breastradiologist: getCount(
            res.RightRecommendation,
            "Breast Radiologist"
          ),
          ClinicalCorrelation: getCount(
            res.RightRecommendation,
            "Clinical Correlation"
          ),
          OncoConsult: getCount(res.RightRecommendation, "Onco Consult"),
          Redo: getCount(res.RightRecommendation, "Redo"),
          USGSFU: getCount(res.RightRecommendation, "USG/SFU"), // note exact name in your array
        });
        // setTatStats([]);
        setTechArtifacts(res.TechArtificate || []);
        setReportArtifacts(res.ReportArtificate || []);
      }

      setLoding(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAnalyticsPeruser = async (userId: number, roleId: number) => {
    if (
      user?.refUserId === null ||
      user?.refUserId === undefined ||
      role?.id === null ||
      role?.id === undefined ||
      dateRange === undefined ||
      dateRange.from === undefined ||
      dateRange.to === undefined
    )
      return;
      setLoding(true);
    try {
      
console.log('Analytics.tsx -------------------------- >  317  ',userId,
        roleId,
        format(dateRange?.from, "yyyy-MM-dd"),
        format(dateRange?.to, "yyyy-MM-dd"));
      const res = await analyticsService.analyticsPerUser(
        userId,
        roleId,
        format(dateRange?.from, "yyyy-MM-dd"),
        format(dateRange?.to, "yyyy-MM-dd")
      );
      if (res.status) {
console.log('Analytics.tsx / res / 323 -------------------  ', res);

        setUserOverAllAnalaytics(
          res.OverAllAnalytics ? res.OverAllAnalytics : []
        );

        setAppointmentCase(
          res.AdminOverallAnalaytics.length > 0
            ? res.AdminOverallAnalaytics
            : []
        );
        setIntakeFormAnalytics(
          res.AdminOverallScanIndicatesAnalaytics.length > 0
            ? res.AdminOverallScanIndicatesAnalaytics
            : []
        );
        setListScanAppointmentCount(
          res.ListScanAppointmentCount ? res.ListScanAppointmentCount : []
        );
        setUserAccessTiming(res.UserAccessTiming ? res.UserAccessTiming : []);
        setRecodeLeft({
          Annualscreening: getCount(res.LeftRecommendation, "Annual Screening"),
          Biopsy: getCount(res.LeftRecommendation, "Biopsy"),
          Breastradiologist: getCount(
            res.LeftRecommendation,
            "Breast Radiologist"
          ),
          ClinicalCorrelation: getCount(
            res.LeftRecommendation,
            "Clinical Correlation"
          ),
          OncoConsult: getCount(res.LeftRecommendation, "Onco Consult"),
          Redo: getCount(res.LeftRecommendation, "Redo"),
          USGSFU: getCount(res.LeftRecommendation, "USG/SFU"), // note exact name in your array
        });

        setRecodeRight({
          Annualscreening: getCount(
            res.RightRecommendation,
            "Annual Screening"
          ),
          Biopsy: getCount(res.RightRecommendation, "Biopsy"),
          Breastradiologist: getCount(
            res.RightRecommendation,
            "Breast Radiologist"
          ),
          ClinicalCorrelation: getCount(
            res.RightRecommendation,
            "Clinical Correlation"
          ),
          OncoConsult: getCount(res.RightRecommendation, "Onco Consult"),
          Redo: getCount(res.RightRecommendation, "Redo"),
          USGSFU: getCount(res.RightRecommendation, "USG/SFU"), // note exact name in your array
        });
        setTotalCorrectEdits(res.TotalCorrectEdit ? res.TotalCorrectEdit : []);
        setTatStats(res.DurationBucketModel ? res.DurationBucketModel : []);
        setReportArtifacts(res.ReportArtificate ? res.ReportArtificate : []);
        setTechArtifacts(res.TechArtificate ? res.TechArtificate : []);
      }
    } catch (error) {
      console.log(error);
    }
    setLoding(false);
  };

  useEffect(() => {
    if (
      user?.refSCId === null ||
      user?.refSCId === undefined ||
      role?.id === null ||
      role?.id === undefined
    )
      return;
    // setTempRole({ id: 0, type: "" });
    // setTatStats([]);

    if (["admin", "scadmin"].includes(role.type)) {
      if (userSelectedValue) {
        setCenterSelectedValue(null);
        fetchAnalyticsPeruser(
          userSelectedValue ? userSelectedValue : user.refUserId,
          tempRole.id ? tempRole.id : role?.id
        );
      } else {
        if (userSelectedValue === 0) {
          setUserSelectedValue(0);
          fetchAnalyticsPeruser(0, tempRole.id ? tempRole.id : role?.id);
        } else {
          setUserSelectedValue(null);
          fetchOverallScanCenter(
            centerSelectedValue || centerSelectedValue == 0
              ? Number(centerSelectedValue)
              : user.refSCId
          );
        }
      }
    } else if (["manager"].includes(role.type)) {
      setCenterSelectedValue(null);
      setUserSelectedValue(0);
      fetchAnalyticsPeruser(0, role?.id);
    } else {
      setCenterSelectedValue(null);
      setUserSelectedValue(
        userSelectedValue ? userSelectedValue : user.refUserId
      );
      fetchAnalyticsPeruser(
        userSelectedValue ? userSelectedValue : user.refUserId,
        role?.id
      );
    }
  }, [dateRange]);

  useEffect(() => {
    if (centerSelectedValue) {
      fetchOverallScanCenter(Number(centerSelectedValue));
    } else if (centerSelectedValue === 0) {
      fetchOverallScanCenter(0);
    }
  }, [centerSelectedValue]);

  useEffect(() => {
    if (userSelectedValue) {
      fetchAnalyticsPeruser(Number(userSelectedValue), tempRole.id);
    } else if (userSelectedValue === 0) {
      
console.log('Analytics.tsx -------------------------- >  453  +++++++++++++++++++');
      fetchAnalyticsPeruser(0, tempRole.id);
    }
  }, [userSelectedValue]);

  return (
    <div className="w-11/12 mx-auto flex flex-col justify-center gap-4 my-5 mt-10 relative">
      {loading && <LoadingOverlay/>}
      <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between">
        <div className="flex flex-wrap gap-4 self-start relative">
          {/* Scan Center Select */}
          {role?.id !== 9 && (
            <Select
              value={
                centerSelectedValue !== null
                  ? centerSelectedValue.toString()
                  : ""
              }
              onValueChange={(val) => {
                setCenterSelectedValue(Number(val));
                setUserSelectedValue(null);
                setTempRole({ id: 0, type: "" });
              }}
            >
              <SelectTrigger
                className={`${
                  centerSelectedValue ? "bg-[#a3b1a0]" : "bg-[#f3f0e9]"
                } font-medium p-6 text-lg`}
                hidden={handleComponentAccess("scancenterselect")}
              >
                <SelectValue placeholder="Scan Center" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key={0} value="0">
                  Over All
                </SelectItem>
                {allScanCenters?.map((option) => (
                  <SelectItem
                    key={option.refSCId}
                    value={option.refSCId.toString()}
                  >
                    {option.refSCName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Users Select */}
          <Select
            value={
              userSelectedValue !== null ? userSelectedValue.toString() : ""
            }
            onValueChange={(val) => {
              setUserSelectedValue(Number(val));
              setCenterSelectedValue(null);

              const selectedUser = allUsers?.find(
                (item) => item.refUserId.toString() == val
              );
              const roleId = selectedUser?.refRTId;

              const roleName = RoleList.find((role) => role.id === roleId);

              roleName &&
                setTempRole({
                  id: roleName.id,
                  type: roleName?.type,
                });
            }}
          >
            <SelectTrigger
              className={`${
                userSelectedValue ? "bg-[#a3b1a0]" : "bg-[#f3f0e9]"
              } font-medium p-6 text-lg`}
              hidden={handleComponentAccess("userselect")}
            >
              <SelectValue placeholder="Users" />
            </SelectTrigger>
            <SelectContent>
              {(role?.type === "admin" ||
                role?.type === "manager" ||
                role?.type === "scadmin") && (
                <SelectItem key={0} value="0">
                  Over All
                </SelectItem>
              )}
              {allUsers?.map((option) => (
                <SelectItem
                  key={option.refUserId}
                  value={option.refUserId.toString()}
                >
                  {option.refUserCustId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {user && role?.type == "admin" && (
            <div
              onClick={() => {
                setUserSelectedValue(user?.refUserId),
                  setCenterSelectedValue(null),
                  setTempRole({ id: 0, type: "" });
              }}
              className={`p-3 rounded-lg my-auto border-[#a3b1a0] border cursor-pointer transition-colors duration-200 flex gap-2
                ${
                  userSelectedValue === user?.refUserId
                    ? "bg-[#a3b1a0]"
                    : "hover:bg-[#e6ede5]"
                }
              `}
            >
              <User />
              <span>My Analytics</span>
            </div>
          )}
        </div>

        <div className="flex items-start justify-between">
          {/* <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-12 px-6 text-base justify-start text-left font-medium", // ⬅️ size boost
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-5 w-5" />{" "}
                {/* ⬅️ Slightly bigger icon */}{" "}
          {/*}
                {date ? format(date, "MMM yyyy") : <span>Pick a month</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <MonthPicker onMonthSelect={setDate} selectedMonth={date} />
            </PopoverContent>
          </Popover> */}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal p-5"
              >
                {dateRange?.from ? (
                  dateRange.to ? (
                    `${format(dateRange.from, "MMM d, yyyy")} - ${format(
                      dateRange.to,
                      "MMM d, yyyy"
                    )}`
                  ) : (
                    format(dateRange.from, "MMM d, yyyy")
                  )
                ) : (
                  <span className="text-muted-foreground">
                    Pick a date range
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                autoFocus
                mode="range"
                selected={dateRange}
                onSelect={handleSelect}
                numberOfMonths={2}
                required={false}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {userSelectedValue === 0 &&
        (role?.type === "admin" || role?.type === "manager") && (
          <OverAllAnalyticsTable analyticsData={UsersOverAllAnalaytics} />
        )}

      {centerSelectedValue === 0 &&
        (role?.type === "admin" || role?.type === "manager") && (
          <ScanCenterOverAllAnalyticsTable
            analyticsData={ScanCenterOverAllAnalaytics}
          />
        )}

      <div className="flex flex-wrap w-full gap-4">
        <div className="bg-[#a3b1a0] p-4 flex-1 max-w-3xs rounded-lg flex items-center justify-between gap-4 relative">
          {/* 🔽 Arrow icon as popover trigger */}
          <Popover>
            <PopoverTrigger
              asChild
              hidden={handleComponentAccess("totalCaseCountPopover")}
            >
              <div className="absolute -top-2 -right-2 m-3 cursor-pointer hover:bg-white/20 rounded-md">
                <ChevronDown className="w-4 h-4 text-white" />
              </div>
            </PopoverTrigger>

            <PopoverContent
              side="bottom"
              align="end"
              className="w-64 p-2"
              sideOffset={4} // optional spacing
            >
              {listScanAppointmentCount?.map((item, index) => (
                <div
                  key={item.refSCId}
                  className="text-xs flex justify-between py-1 border-b last:border-none"
                >
                  <span className="w-6">{index + 1}.</span>
                  <span className="flex-1">{item.refSCName}</span>
                  <span className="font-medium">{item.total_appointments}</span>
                </div>
              ))}
            </PopoverContent>
          </Popover>

          {/* Main content */}
          <span className="w-2/3 leading-tight text-sx font-semibold">
            Total Case Count
          </span>
          <span className="w-1/3 font-bold text-3xl">
            {intakeFormAnalytics ? intakeFormAnalytics[0]?.total_appointments : 0}
          </span>
        </div>

        {userSelectedValue !== 0 && userSelectedValue !== null && (
          <>
            <div
              className="bg-[#a3b1a0] p-4 flex-1 max-w-3xs rounded-lg flex items-center justify-between gap-4"
              hidden={handleComponentAccess("totalCorrect")}
            >
              <span className="w-2/3 leading-tight text-sx font-semibold">
                Total Correct
              </span>
              <span className="w-1/3 font-bold text-3xl">
                {totalCorrectEdits[0]?.totalCorrect}
              </span>
            </div>

            <div
              className="bg-[#a3b1a0] p-4 flex-1 max-w-3xs rounded-lg flex items-center justify-between gap-4"
              hidden={handleComponentAccess("totalEdit")}
            >
              <span className="w-2/3 leading-tight text-sx font-semibold">
                Total Edit
              </span>
              <span className="w-1/3 font-bold text-3xl">
                {totalCorrectEdits[0]?.totalEdit}
              </span>
            </div>
            <div
              className="bg-[#a3b1a0] p-4 flex-1 max-w-3xs rounded-lg flex items-center justify-between gap-4"
              hidden={handleComponentAccess("TAT")}
            >
              <span className="w-1/3 leading-tight text-sx font-semibold">
                Total Time
              </span>
              <span className="w-2/3 font-bold text-xl">
                {userAccessTiming ? userAccessTiming[0]?.total_hours || 0 : 0}{" "}
                Hrs
              </span>
            </div>
          </>
        )}
      </div>

      {/* ---------- Row 1 ---------- */}
      <div className="flex flex-wrap gap-4 w-full">
        <div className="flex flex-wrap lg:flex-nowrap w-full gap-4">
          {!handleComponentAccess("previousMonth") && (
            <div
              className={
                !(
                  !handleComponentAccess("turnaroundTime") &&
                  userSelectedValue != null
                )
                  ? "w-full"
                  : `w-full ${userSelectedValue !== 0 ? "lg:w-2/3" : ""}`
              }
            >
              <TotalAppointmentCase appointmentData={appointmentCase} />
            </div>
          )}

          {userSelectedValue !== 0 && (
            <>
              {!handleComponentAccess("turnaroundTime") &&
                userSelectedValue != null && (
                  <div className="w-full lg:w-1/3">
                    <TATPieChart data={tatStats} />
                  </div>
                )}
            </>
          )}
        </div>
      </div>

      {/* ---------- Row 2 ---------- */}
      {userSelectedValue !== 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 max-w-5xl mx-auto">
            {!handleComponentAccess("scanIndications") && (
              <div className="w-full">
                <ScanIndicationsPie data={intakeFormAnalytics} />
              </div>
            )}

            {!handleComponentAccess("recoCodeCount") && (
              <div className="w-full">
                <RecoCodeCountPie Side={"Left"} data={recoCodeLeft} />
              </div>
            )}

            {!handleComponentAccess("recoCodeCount") && (
              <div className="w-full">
                <RecoCodeCountPie Side={"Right"} data={recoCodeRight} />
              </div>
            )}

            {!handleComponentAccess("techArtifact") && (
              <div className="w-full">
                <ArtifactsPie data={techArtifacts} label="Tech Artifact" />
              </div>
            )}

            {!handleComponentAccess("reportArtifact") && (
              <div className="w-full">
                <ArtifactsPie data={reportArtifacts} label="Report Artifact" />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
