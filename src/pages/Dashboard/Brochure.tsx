import React from "react";
import {
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import logoNew from "../../assets/LogoNew2.png";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

const Brochure: React.FC = () => {
  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-[#e9e7e3] shadow-sm mx-3 lg:mx-10 mt-6 rounded-md p-5">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="space-y-2 text-sm text-justify">{children}</div>
    </div>
  );

  const ListItem = ({ icon, text }: { icon?: React.ReactNode; text: string }) => (
    <div className="flex items-center gap-1">
      <div className="ml-4">{icon || <li className="w-4 h-4" />}</div>
      <div>{text}</div>
    </div>
  );

  return (
    <DialogContent
      style={{
        background:
          "radial-gradient(100.97% 186.01% at 50.94% 50%, #F9F4EC 25.14%, #EED8D6 100%)",
      }}
      className="w-[100vw] lg:w-[70vw] h-[90vh] overflow-y-auto p-0"
    >
      <DialogHeader className="bg-[#eac9c5] border-1 border-b-gray-400 flex flex-col lg:flex-row items-center justify-between px-4 py-2">
            {/* Logo (Left) */}
            <div className="h-12 w-24 sm:h-14 sm:w-28 flex-shrink-0">
              <img
                src={logoNew}
                alt="logo"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Centered Content */}
            <div className="flex-1 text-center">
              <h2 className="text-2xl font-semibold">Patient Brochure: Understanding QT Breast Imaging</h2>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                EaseQT Platform
              </p>
            </div>

            {/* Spacer to balance logo width */}
            <div className="hidden lg:inline h-12 w-24 sm:h-14 sm:w-28 flex-shrink-0" />
          </DialogHeader>

      <div className="w-full h-auto mx-auto px-5 lg:px-10">
        <div className="border-2 border-gray-300 rounded-2xl shadow-2xl">
        <Section title="A Radiation-Free, Comfortable Option for Breast Screening and Monitoring">
          <p>
            QT Imaging is a new, FDA-cleared, radiation-free imaging technique that uses sound waves (ultrasound) instead of X-rays to create detailed 3D images of the breast. It is safe, non-invasive, and comfortable, making it suitable for women of all ages and breast densities—including younger women and those with dense breasts.
          </p>
        </Section>

        <Section title="Why Choose QT Imaging?">
          {[
            "No Radiation",
            "No Compression",
            "FDA-Cleared for Breast Imaging",
            "Ideal for Dense Breasts",
            "Safe for Frequent Monitoring",
            "Comfortable, Quick, and Non-Invasive",
          ].map((text) => (
            <ListItem icon={<CheckCircle className="text-green-600 w-4 h-4" />} text={text} />
          ))}
        </Section>

        <Section title="Patient Eligibility Requirements">
          <p className="font-medium">✅ You May Be a Good Candidate If You:</p>
          {[
            "Are a female patient over 18 years of age",
            "Have breast size DDD cup or smaller",
            "Weigh 350 lbs or less",
            "Can lie flat comfortably for minimum 15 minutes",
            "Meet FDA-approved indications for QT imaging",
          ].map((text) => (
            <ListItem icon={<CheckCircle className="text-green-600 w-4 h-4" />} text={text} />
          ))}

          <p className="mt-4 font-medium">🚫 QT Imaging Is Not Suitable If You:</p>
          {[
            "Are pregnant (any trimester)",
            "Are currently breastfeeding or lactating",
            "Have open wounds or lesions on breast skin",
            "Have severe mobility limitations that prevent proper positioning",
          ].map((text) => (
            <ListItem icon={<XCircle className="text-red-500 w-4 h-4" />} text={text} />
          ))}

          <p className="mt-4 font-medium">⚠️ Please Discuss With Your Healthcare Provider If You Have:</p>
          {[
            "Are pregnant (any trimester)",
            "Are currently breastfeeding or lactating",
            "Have open wounds or lesions on breast skin",
            "Have severe mobility limitations that prevent proper positioning",
            "Tremors or involuntary movements",
            "Persistent coughing or breathing difficulties",
            "Claustrophobia or anxiety about enclosed spaces",
            "Recent breast surgery",
          ].map((text) => (
            <ListItem icon={<AlertTriangle className="text-yellow-500 w-4 h-4" />} text={text} />
          ))}
        </Section>

        <Section title="When is QT Imaging Used?">
          <p className="font-semibold">🔘 Screening Indications</p>
          {[
            "First-time breast imaging",
            "Annual check-up or wellness screening",
            "Ideal for women starting at age 40—or younger if high risk",
            "Especially recommended for women with dense breast tissue",
          ].map((text) => (
            <ListItem text={text} />
          ))}

          <p className="mt-4 font-semibold">🔘 Diagnostic Indications</p>
          {[
            "Follow-up after abnormal mammogram, ultrasound, or MRI",
            "Monitoring biopsy-proven breast cancer or DCIS",
            "Comparing with previous QT scans (DICOM upload recommended)",
          ].map((text) => (
            <ListItem text={text} />
          ))}
        </Section>

        <Section title="What is Breast Density, and Why Does It Matter?">
          <p>
            Dense breasts contain more fibrous or glandular tissue and less fat, making cancer harder to detect on X-rays. QT Imaging visualizes dense tissue effectively without radiation, making it a valuable complementary screening option.
          </p>
        </Section>

        <Section title="Is QT Imaging a Replacement for Mammograms?">
          <p>
            No, QT is not a replacement but a supplementary tool. It is ideal for:
          </p>
          {[
            "Women with dense breasts",
            "Individuals avoiding radiation or compression",
            "Patients needing more frequent imaging",
          ].map((text) => (
            <ListItem text={text} />
          ))}

          <p className="mt-2">
            Always consult your doctor for personalized screening recommendations.
          </p>
        </Section>

        <Section title="What to Expect During the QT Scan">
          <p className="font-semibold">The Procedure:</p>
          {[
            "Lie face down on a padded table",
            "Breasts are placed in warm, water-filled chambers",
            "Images are captured using sound waves (15-20 minutes)",
            "No radiation or compression involved",
          ].map((text) => (
            <ListItem text={text} />
          ))}

          <p className="font-semibold mt-4">Your Comfort and Safety:</p>
          {[
            "Technologist explains procedure and addresses questions",
            "Water temperature is optimized for comfort",
            "You may stop the procedure at any time",
          ].map((text) => (
            <ListItem text={text} />
          ))}
        </Section>

        <Section title="Prepare for Your Appointment">
          {[
            "Upload or bring prior imaging reports (Ultrasound/Mammogram/MRI, last 3 years)",
            "Note symptoms or diagnosis changes",
            "Bring medications list and treatment history",
            "Arrive 15 minutes early",
            "Wear two-piece clothing and remove jewelry from chest/neck",
          ].map((text) => (
            <ListItem text={text} />
          ))}
        </Section>

        <Section title="What Happens After Your Scan?">
          {[
            "A radiologist will review your scan",
            "Results sent to your referring physician",
            "Doctor will discuss findings and next steps",
          ].map((text) => (
            <ListItem text={text} />
          ))}
        </Section>

        <Section title="Important Reminders">
          {[
            "QT is supplementary to regular breast health care",
            "Always bring previous reports for comparison",
            "Inform your healthcare provider about new symptoms",
          ].map((text) => (
            <ListItem text={text} />
          ))}
        </Section>

        <div className="bg-[#e9e7e3] shadow-sm mx-3 lg:mx-10 mt-6 mb-6 rounded-md p-5">
          <p className="text-sm text-justify">
            <b>Questions?</b> If you have questions about QT Imaging, your eligibility, or what to expect, please contact our team. We're here to ensure your experience is informative, safe, and comfortable.
          </p>
        </div>

        <div className="mx-3 lg:mx-10 mt-6 mb-6 rounded-md p-5">
          <p className="text-sm text-justify italic">
            This brochure provides general information about QT breast imaging. Always consult with your healthcare provider for personalized medical advice and to determine if QT imaging is appropriate for your specific situation
          </p>
        </div>
      </div>
      </div>
      
    </DialogContent>
  );
};

export default Brochure;
