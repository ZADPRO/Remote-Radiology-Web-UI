import { patientInTakeService } from "@/services/patientInTakeFormService";
import React, { useEffect, useRef, useState } from "react";
import PatientInTakeForm01 from "./PatientInTakeFormS/PatientInTakeForm01";
import { FileData } from "@/services/commonServices";
import { useLocation, useNavigate } from "react-router-dom";
import MainInTakeForm from "./MainInTakeForm";
import PatientInTakeForm02 from "./PatientInTakeFormDa/PatientInTakeForm02";
import PatientInTakeForm03 from "./PatientInTakeFormDb/PatientInTakeForm03";
import PatientInTakeForm04 from "./PatientInTakeFormDC/PatientInTakeForm04";
import { SubmitDialog } from "./SubmitDialog";
import LoadingOverlay from "@/components/ui/CustomComponents/loadingOverlay";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
export interface IntakeOption {
  questionId: number;
  answer: string;
  refITFId?: number;
  verifyTechnician?: boolean;
  file?: FileData;
}

export interface PatientInTakeFormNavigationState {
  categoryId?: number;
  fetchFormData: boolean;
  fetchTechnicianForm?: boolean;
  appointmentId: number;
  apiUpdate?: boolean;
  readOnly?: boolean;
  userId?: number;
  name?: string;
  custId?: string;
  scancenterCustId?: string;
  consent?: string;
  reportview?: boolean;
  OverrideStatus?: string;
}

interface PatientInTakeFormProps
  extends Partial<PatientInTakeFormNavigationState> {}

export interface PatientSubmitDialogProps {
  open: boolean;
  onClose: () => void;
}

interface PatientContextType {
  name?: string;
  custId?: string;
  scancenterCustId?: string;
  reportview?: boolean;
}

export const PatientContext = React.createContext<PatientContextType | null>(
  null
);

const PatientInTakeForm: React.FC<PatientInTakeFormProps> = (props) => {
  const [formData, setFormData] = useState<IntakeOption[]>(
    Array.from({ length: 555 }, (_, index) => ({
      questionId: 1 + index,
      answer: "",
    }))
  );

  const [loading, setLoading] = useState(false);

  const [activeForm, setActiveForm] = useState(1);

  const handleFormSwitch = (formNumber: number) => {
    setActiveForm(formNumber);
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);
  // const [patientData, setPatientData] = useState({
  //   name: "",
  //   dob: "",
  //   phonenumber: "",
  //   email: "",
  //   gender: "",
  // });

  const navigate = useNavigate();

  const location = useLocation();
  const locationState =
    location.state as PatientInTakeFormNavigationState | null;

  const controlData: PatientInTakeFormNavigationState = {
    fetchFormData: props.fetchFormData ?? locationState?.fetchFormData ?? false,
    fetchTechnicianForm:
      props.fetchTechnicianForm ?? locationState?.fetchTechnicianForm,
    appointmentId: props.appointmentId ?? locationState?.appointmentId ?? 0,
    apiUpdate: props.apiUpdate ?? locationState?.apiUpdate,
    readOnly: props.readOnly ?? locationState?.readOnly,
    userId: props.userId ?? locationState?.userId,
    categoryId: props.categoryId ?? locationState?.categoryId,
    consent: props.consent ?? locationState?.consent ?? "",
    reportview: props.reportview ?? locationState?.reportview,
    OverrideStatus: locationState?.OverrideStatus || "",
  };

  useEffect(() => {
    if (
      // controlData.fetchFormData == true &&
      controlData.userId != undefined &&
      controlData.appointmentId != undefined
    ) {
      handleFetchPatientForm(controlData.userId, controlData.appointmentId);
    }

    console.log(
      "PatientInTakeForm.tsx / controlData / 114 -------------------  ",
      controlData.appointmentId,
      controlData.userId
    );

    // if (
    //   controlData.OverrideStatus === "approved" &&
    //   controlData.userId != undefined &&
    //   controlData.appointmentId != undefined
    // ) {
    //   handleFetchPatientForm(controlData.userId, controlData.appointmentId);
    // }

    // if (controlData.categoryId) {
    //   if (controlData.categoryId == 1) {
    //     setActiveForm(controlData.categoryId);
    //   } else {
    //     setActiveForm(5);
    //   }
    // }
  }, []);

  const [showDialog, setShowDialog] = useState(false);

  const allowNavigationRef = useRef(false);

  const handleLeave = async (saveStatus: boolean) => {
    allowNavigationRef.current = true;
    setShowDialog(false);

    if (saveStatus) {
      // console.log("================>", {
      //   appointmentId: locationState?.appointmentId,
      //   patientId: locationState?.userId,
      // });
      handleFinalSubmit(true);
      // assignData?.appointmentStatus[0]?.refAppointmentComplete &&
      //   (await handleReportSubmit(
      //     assignData?.appointmentStatus[0]?.refAppointmentComplete,
      //     false,
      //     true
      //   ));
    } else navigate(-1);
  };

  useEffect(() => {
    if (locationState?.readOnly === false) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        if (!allowNavigationRef.current) {
          e.preventDefault();
          e.returnValue = "";
        }
      };

      const handlePopState = () => {
        if (!allowNavigationRef.current) {
          setShowDialog(true);

          // 🛠 Preserve React Router state when modifying history
          const preservedState = {
            ...window.history.state,
            usr: location.state,
          };
          history.replaceState(preservedState, "", window.location.href);
          history.pushState(preservedState, "", window.location.href);
        }
      };

      window.addEventListener("beforeunload", handleBeforeUnload);
      window.addEventListener("popstate", handlePopState);

      // 🛠 Do the same when setting up initially
      const preservedState = { ...window.history.state, usr: location.state };
      history.replaceState(preservedState, "", window.location.href);
      history.pushState(preservedState, "", window.location.href);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, []);

  useEffect(() => {
    if (allowNavigationRef.current) {
      navigate(-1);
    }
  }, [allowNavigationRef.current]);

  const handleFetchPatientForm = async (
    userID: number,
    appointmentId: number
  ) => {
    setLoading(true);
    try {
      const res = await patientInTakeService.fetchPatientInTakeForm(
        userID,
        appointmentId
      );
      console.log(
        "PatientInTakeForm.tsx / res / 214 -------------------  ",
        res
      );

      if (res.status) {
        if (controlData.apiUpdate && controlData.categoryId) {
          console.log("Before update:", res.data);

          let updatedData = res.data.map((item: any) =>
            item.questionId === 170
              ? { ...item, answer: String(controlData.categoryId) }
              : item
          );

          if (res.data === null) {
            updatedData = Array.from({ length: 555 }, (_, index) => ({
              questionId: 1 + index,
              answer: "",
            }));
          }

          console.log(
            "After update:",
            updatedData.find((item: any) => item.questionId === 170)
          );
          setFormData(updatedData);
        } else {
          if (controlData.OverrideStatus === "approved") {
            const newData = Array.from({ length: 555 }, (_, index) => {
              const existing = res.data.find(
                (q: any) => q.questionId === 1 + index
              );
              return {
                questionId: 1 + index,
                answer: existing ? existing.answer : "",
              };
            });

            setFormData(newData);
          } else {
            let updatedData = res.data.map((item: any) =>
              item.questionId === 170
                ? {
                    ...item,
                    answer:
                      controlData.categoryId !== undefined &&
                      controlData.categoryId !== null
                        ? String(controlData.categoryId)
                        : item.answer, // ✅ keep old answer if categoryId not present
                  }
                : item
            );

            if (res.data === null) {
              updatedData = Array.from({ length: 555 }, (_, index) => ({
                questionId: 1 + index,
                answer: "",
              }));
            }
            setFormData(updatedData);
          }
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleFinalSubmit = async (saveStatus?: boolean) => {
    setIsSubmitting(true);
    setSubmitError(null);

    console.log(
      "PatientInTakeForm.tsx -------------------------- >  295  ",
      controlData.appointmentId,
      controlData.userId
    );

    const overide =
      formData.find((item) => item.questionId === 10)?.answer === "YES"
        ? false
        : true;

    const payload = {
      appointmentId: controlData.appointmentId,
      patientId: controlData.userId,
      answers: formData,
      categoryId:
        parseInt(
          formData.find((item) => item.questionId === 170)?.answer || ""
        ) || null,
      overriderequest: overide,
      consent: controlData.consent,
      patientIntakeStartTime:
        localStorage.getItem("patientIntakeStartTime") || "",
      saveStatus: saveStatus ? true : false,
    };

    console.log("payload", payload);

    try {
      let res;
      if (controlData.apiUpdate) {
        res = await patientInTakeService.updatePatientInTakeForm(payload);
      } else {
        res = await patientInTakeService.addPatientInTakeForm(payload);
      }

      if (res.status) {
        if (controlData.apiUpdate) {
          navigate(-1); // go back if successF
        }else{
          allowNavigationRef.current = true;
          navigate(-1); // go back if success
        }
      } else {
        setSubmitError("Something went wrong. Please try again.");
      }
    } catch (error) {
      setSubmitError("Failed to submit. Please try again later.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Navigation</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to leave this page? Changes you made may not
            be saved.
          </p>
          <DialogFooter className="mt-4">
            <Button variant="secondary" onClick={() => setShowDialog(false)}>
              Stay
            </Button>
            <Button variant="destructive" onClick={() => handleLeave(false)}>
              Leave anyway
            </Button>
            <Button variant="greenTheme" onClick={() => handleLeave(true)}>
              Save and Leave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <PatientContext.Provider
        value={{
          name: locationState?.name,
          custId: locationState?.custId,
          scancenterCustId: locationState?.scancenterCustId,
          reportview: props.reportview,
        }}
      >
        {loading && <LoadingOverlay />}
        {activeForm == 1 && (
          <PatientInTakeForm01
            formData={formData}
            setFormData={setFormData}
            handleFormSwitch={handleFormSwitch}
            openSubmitDialog={handleOpenDialog}
            readOnly={controlData.readOnly ? true : false}
            OverrideStatus={controlData?.OverrideStatus || ""}
            userId={controlData.userId || 0}
          />
        )}

        {activeForm == 5 && (
          <MainInTakeForm
            formData={formData}
            setFormData={setFormData}
            handleFormSwitch={handleFormSwitch}
            controlData={controlData}
            openSubmitDialog={handleOpenDialog}
            readOnly={controlData.readOnly ? true : false}
          />
        )}
        {activeForm == 2 && (
          <PatientInTakeForm02
            formData={formData}
            setFormData={setFormData}
            handleFormSwitch={handleFormSwitch}
            openSubmitDialog={handleOpenDialog}
            readOnly={controlData.readOnly ? true : false}
          />
        )}

        {activeForm == 3 && (
          <PatientInTakeForm03
            formData={formData}
            setFormData={setFormData}
            handleFormSwitch={handleFormSwitch}
            openSubmitDialog={handleOpenDialog}
            readOnly={controlData.readOnly ? true : false}
          />
        )}

        {activeForm == 4 && (
          <PatientInTakeForm04
            formData={formData}
            setFormData={setFormData}
            handleFormSwitch={handleFormSwitch}
            openSubmitDialog={handleOpenDialog}
            readOnly={controlData.readOnly ? true : false}
          />
        )}

        {!controlData.readOnly && (
          <SubmitDialog
            open={isDialogOpen}
            onClose={handleCloseDialog}
            onSubmit={()=>{
              handleFinalSubmit(false)
            }}
            isSubmitting={isSubmitting}
            error={submitError}
          />
        )}
      </PatientContext.Provider>
    </div>
  );
};

export default PatientInTakeForm;
