import { Button } from "@/components/ui/button";
import LoadingOverlay from "@/components/ui/CustomComponents/loadingOverlay";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { reportService } from "@/services/reportService";
import React, { useState } from "react";
import { toast } from "sonner";

interface Props {
  appointmentId: number;
  patientId: number;
  showMailDialog: boolean;
  setShowMailDialog: React.Dispatch<React.SetStateAction<boolean>>;
  handleRefreshData: () => void;
}

const SendMailDialog: React.FC<Props> = ({
  appointmentId,
  patientId,
  showMailDialog,
  setShowMailDialog,
  handleRefreshData
}) => {
  const [mailOption, setMailOption] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSendMail = async () => {
    setLoading(true);
    try {
      const payload = {
        appintmentId: appointmentId,
        patientId: patientId,
        patientMailStatus: mailOption === "patient" || mailOption === "both",
        managerMailStatus: mailOption === "scancenter" || mailOption === "both",
      };
      const res = await reportService.sendMailPatienteport(payload);

      if (res.status) {
        toast.success(res.message);
        setShowMailDialog(false);
        handleRefreshData();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={showMailDialog} onOpenChange={() => !loading && setShowMailDialog(false)}>
      <DialogContent className="sm:max-w-[400px]">
        {loading && <LoadingOverlay />}
        <DialogHeader>
          <DialogTitle>Select Email Recipients</DialogTitle>
          <DialogDescription>
            Select recipients to proceed with sending the email.
          </DialogDescription>
        </DialogHeader>

        <div>
          <Select value={mailOption} onValueChange={setMailOption}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose recipient" />
            </SelectTrigger>
            <SelectContent>
              {/* <SelectItem value="none">None</SelectItem> */}
              <SelectItem value="patient">Patient</SelectItem>
              <SelectItem value="scancenter">Scan Center Manager</SelectItem>
              <SelectItem value="both">
                Patient and Scan Center Manager
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button
            variant="greenTheme"
            disabled={!mailOption}
            onClick={() => {
              handleSendMail()
            }}
          >
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SendMailDialog;
