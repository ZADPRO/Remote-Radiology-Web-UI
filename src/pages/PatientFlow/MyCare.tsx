import DatePicker from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppointmentAdd, appointmentService } from "@/services/patientInTakeFormService";
import React, { useState } from "react";
import women_img from "../../assets/Patient/Women_Doctor.png";
import { useAuth } from "../Routes/AuthContext";
import { useNavigate } from "react-router-dom";

const MyCare: React.FC = () => {
  const [appointmentData, setAppointmentData] = useState<AppointmentAdd>({
    refSCId: "",
    refAppointmentDate: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  const getGreetingWithEmoji = () => {
    const hour = new Date().getHours();

    if (hour < 12) return { emoji: "🌞", text: "Good Morning" };
    if (hour < 17) return { emoji: "🌤️", text: "Good Afternoon" };
    return { emoji: "🌙", text: "Good Evening" };
  };

  const greeting = getGreetingWithEmoji();

  const handleSubmitAppointment = async () => {
    setIsLoading(true); // Set loading to true when submission starts
    setError(null); // Clear any previous errors

    try {
      const res = await appointmentService.addAppointment(appointmentData);

      if (res.status) {
        navigate("../medicalHistory");
      } else {
        // Assuming 'res.message' contains the error message from the API
        const errorMessage = res.message || "Failed to add appointment. Please try again.";
        setError(errorMessage);
      }
    } catch (err) {
      console.error("Error adding appointment:", err);
      const errorMessage = "An unexpected error occurred. Please try again later.";
      setError(errorMessage);
    } finally {
      setIsLoading(false); // Set loading to false when submission finishes (success or failure)
    }
  };

  return (
    <div className="px-4 py-6 mb-5 h-[90vh] md:px-10 lg:px-20 lg:py-10">
      {/* Greeting Section */}
      <div>
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <span>{greeting.emoji}</span>
          <span>{greeting.text}</span>
        </div>
        <h2
          className={`font-bold text-[#1E1E4B] mt-1 ${
            (user?.refUserFirstName || "").length +
              (user?.refUserLastName || "").length <
            12
              ? "text-2xl sm:text-3xl"
              : "text-xl"
          }`}
        >
          {(user?.refUserFirstName || "") + " " + (user?.refUserLastName || "")}
        </h2>
      </div>

      {/* Hero Section - Title and Paragraph */}
      <div className="w-full mt-4 space-y-1 md:w-[80%] lg:w-[65%]">
        <h1 className="font-bold text-4xl leading-tight tracking-wide sm:text-5xl lg:text-6xl lg:leading-[108%]">
          Gentle Care Confident Screening
        </h1>
        <p className="text-sm sm:text-base">
          At EaseQT, we offer gentle, advanced breast screenings in a warm,
          caring environment, empowering you to take charge of your health with
          confidence.
        </p>
      </div>

      {/* Appointment Form and Image Section */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitAppointment();
        }}
        className="bg-radial-greeting flex flex-col rounded-lg mt-4 lg:flex-row"
      >
        {/* Form Section */}
        <div className="flex flex-col gap-4 px-4 py-6 w-full lg:w-[50%] lg:px-15 lg:py-10">
          <Label className="text-sm sm:text-base">
            <span className="text-red-500">*</span>Kindly use the code that was
            sent to your email
          </Label>

          {/* Scan Code */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <Label htmlFor="scan-code" className="min-w-[120px] sm:min-w-[150px]">
              Scan Code
            </Label>
            <Input
              id="scan-code"
              type="text"
              className="flex-1"
              value={appointmentData.refSCId}
              onChange={(e) =>
                setAppointmentData((prev) => ({
                  ...prev,
                  refSCId: e.target.value,
                }))
              }
              required
            />
          </div>

          {/* Date of Appointment */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <Label htmlFor="appointment-date" className="min-w-[120px] sm:min-w-[150px]">
              Date of Appointment
            </Label>
            <div className="flex-1">
              <DatePicker
                value={
                  appointmentData.refAppointmentDate
                    ? new Date(appointmentData.refAppointmentDate)
                    : undefined
                }
                onChange={(val) => {
                  setAppointmentData((prev) => ({
                    ...prev,
                    refAppointmentDate: val?.toLocaleDateString("en-CA") || "",
                  }));
                }}
                required
              />
            </div>
          </div>

          {/* Error Message Display */}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          {/* Submit Button */}
          <div className="flex items-end justify-end mt-4">
            <Button
              className="bg-[#A3B1A1] hover:bg-[#81927f] w-full sm:w-full lg:w-2/5"
              type="submit"
              disabled={isLoading} // Disable button when loading
            >
              {isLoading ? "Processing..." : "Proceed To Fill Form"}
            </Button>
          </div>
        </div>

        {/* Image Section */}
        {/* The image is hidden on smaller screens (hidden) and only shown on large screens (lg:block) */}
        <div className="hidden w-full lg:block relative h-48 self-end overflow-hidden lg:w-[35%] lg:h-auto lg:overflow-visible">
          <img
            src={women_img}
            alt="women_img"
            className="absolute bottom-0 left-11/12 transform -translate-x-1/2 h-[20rem] object-contain sm:h-[25rem] lg:h-[30rem]"
          />
        </div>
      </form>
    </div>
  );
};

export default MyCare;