import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IntakeOption } from "./MainInTakeForm";
import { patientInTakeService } from "@/services/patientInTakeFormService";

interface SubmitDialogProps {
  open: boolean;
  onClose: () => void;
  formData: IntakeOption[];
  mainFormData?: any;
  appointmentId?: number;
}

export const SubmitDialog: React.FC<SubmitDialogProps> = ({
  open,
  onClose,
  formData,
  mainFormData,
  appointmentId
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const payload = {
        categoryId: mainFormData.categoryId,
        overriderequest: formData.find((item) => item.questionId === 10)?.answer === "YES"
        ? false
        : true,
        appointmentId: appointmentId,
        answers: formData,
      };

  console.log(payload);
  console.log(appointmentId)
  console.log(mainFormData)
  const handleSubmitCheck = () => {
    const overide =
      formData.find((item) => item.questionId === 10)?.answer === "YES"
        ? false
        : true;
    if (overide == true) {
      const payload = {
        categoryId: null,
        overriderequest: overide,
        appointmentId: appointmentId,
        answers: formData.filter((item) => item.questionId <= 13),
      };
      handleFinalSubmit(payload);
    } else {
      const payload = {
        categoryId: mainFormData.categoryId,
        overriderequest: overide,
        appointmentId: appointmentId,
        answers: formData,
      };
      handleFinalSubmit(payload);
    }
  };

  const handleFinalSubmit = async (payload: any) => {
  setIsSubmitting(true);
  setError(null); // Reset error

  try {
    console.log(payload);
    const res = await patientInTakeService.addPatientInTakeForm(payload);

    if (res.status) {
      navigate(-1);
      onClose();
    } else {
      setError("Submission failed. Please try again.");
    }
  } catch (error) {
    console.error(error);
    setError("An unexpected error occurred.");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="lg:w-1/2">
        <DialogHeader>
          <DialogTitle>Confirm Submission</DialogTitle>
          <DialogDescription>
            Are you sure you want to submit the patient intake form?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmitCheck} disabled={isSubmitting} className="bg-[#f0d9d3] hover:bg-[#ebcbc2] text-[##3F3F3D] border-1 border-[#3F3F3D] rounded-lg px-6 py-2">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Confirm & Submit"
            )}
          </Button>
        </DialogFooter>
        {error && (
  <p className="text-sm text-red-500 mt-2">{error}</p>
)}
      </DialogContent>
    </Dialog>
  );
};
