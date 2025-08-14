import { patientInTakeService } from "@/services/patientInTakeFormService";
import React, { useEffect, useState } from "react";
import PatientInTakeForm01 from "./PatientInTakeFormS/PatientInTakeForm01";
import { FileData } from "@/services/commonServices";
import { useLocation, useNavigate } from "react-router-dom";
import MainInTakeForm from "./MainInTakeForm";
import PatientInTakeForm02 from "./PatientInTakeFormDa/PatientInTakeForm02";
import PatientInTakeForm03 from "./PatientInTakeFormDb/PatientInTakeForm03";
import PatientInTakeForm04 from "./PatientInTakeFormDC/PatientInTakeForm04";
import { SubmitDialog } from "./SubmitDialog";
import LoadingOverlay from "@/components/ui/CustomComponents/loadingOverlay";
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
    Array.from({ length: 520 }, (_, index) => ({
      questionId: 1 + index,
      answer: "",
    }))
  );

  // 519

  const [loading, setLoading] = useState(false);

  const [activeForm, setActiveForm] = useState(1);

  const handleFormSwitch = (formNumber: number) => {
    setActiveForm(formNumber);
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);

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
  };

  console.log(locationState);

  useEffect(() => {
    if (
      controlData.fetchFormData == true &&
      controlData.userId != undefined &&
      controlData.appointmentId != undefined
    ) {
      handleFetchPatientForm(controlData.userId, controlData.appointmentId);
    }

    if (controlData.categoryId) {
      if (controlData.categoryId == 1) {
        setActiveForm(controlData.categoryId);
      } else {
        setActiveForm(5);
      }
    }
  }, [useLocation().state]);

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
      console.log(res);

      if (res.status) {
  if (controlData.apiUpdate && controlData.categoryId) {
    console.log("Before update:", res.data);

    const updatedData = res.data.map((item: any) =>
      item.questionId === 170
        ? { ...item, answer: String(controlData.categoryId) }
        : item
    );

    console.log("After update:", updatedData.find((item: any) => item.questionId === 170));
    setFormData(updatedData);

  } else {
    setFormData(res.data);
  }

  console.log("Final formData:", res.data);
}

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    const overide =
      formData.find((item) => item.questionId === 10)?.answer === "YES"
        ? false
        : true;

    const payload = {
      appointmentId: controlData.appointmentId,
      patientId: controlData.userId,
      answers:
        overide == true
          ? formData.filter((item) => item.questionId <= 13)
          : formData,
      categoryId:
        parseInt(
          formData.find((item) => item.questionId === 170)?.answer || ""
        ) || null,
      overriderequest: overide,
      consent: controlData.consent,
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
        navigate(-1); // go back if success
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
            onSubmit={handleFinalSubmit}
            isSubmitting={isSubmitting}
            error={submitError}
          />
        )}
      </PatientContext.Provider>
    </div>
  );
};

export default PatientInTakeForm;
