import React from "react";
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

interface SubmitDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  error: string | null;
}

export const TechnicianFormSubmitDialog: React.FC<SubmitDialogProps> = ({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  error,
}) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="lg:w-1/2 lg:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Confirm Submission</DialogTitle>
          <DialogDescription>
            Are you sure you want to submit the form?
            <br />
            <span className="text-yellow-700 font-medium mt-2 inline-block">
              ⚠️ Once submitted, changes can’t be made.
            </span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="bg-[#f0d9d3] hover:bg-[#ebcbc2] text-[#3F3F3D] border border-[#3F3F3D] rounded-lg px-6 py-2"
          >
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
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </DialogContent>
    </Dialog>
  );
};
