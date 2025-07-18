import React from "react";
import {
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import logoNew from "../../assets/LogoNew2.png";
import { Dot } from "lucide-react";

const GeneralGuidelines: React.FC = () => {
  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-[#e9e7e3] shadow-sm mx-3 lg:mx-10 my-6 rounded-md p-5">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="space-y-2 text-sm text-justify">{children}</div>
    </div>
  );

  const ListItem = ({ icon, text }: { icon?: React.ReactNode; text: string }) => (
    <div className="flex items-start gap-2">
      <div className="mt-[2px]">{icon || <Dot className="w-4 h-4" />}</div>
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
              <h2 className="text-2xl font-semibold">General Guidelines for Early Breast Cancer Detection</h2>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                EaseQT Platform
              </p>
            </div>

            {/* Spacer to balance logo width */}
            <div className="hidden lg:inline h-12 w-24 sm:h-14 sm:w-28 flex-shrink-0" />
          </DialogHeader>

      <div className="w-full h-auto mx-auto px-5 lg:px-10">
        <div className="border-2 border-gray-300 rounded-2xl shadow-2xl">
        <Section title="American College of Radiology & Society of Breast Imaging Recommendations">
          <p className="text-sm">
            The patient may discuss with their clinician the adoption of these guidelines to allow early breast cancer detection, which may be based on their individual risk factors and values.
          </p>

          <ListItem text="Annual mammography screening beginning at the age of 40 (or earlier from age 25–30 years if there is a strong family history of breast cancer) and continuing for as long as the woman is in good health." />

          <ListItem text="Supplemental annual breast ultrasound screening for women especially with dense breast parenchyma and implants as these may make detection of lesions difficult on mammography." />

          <ListItem text="Supplemental annual screening breast MRI for women at increased lifetime risk for breast or ovarian cancer (e.g., family history, genetic tendency, past breast cancer)." />

          <ListItem text="Some cancers are not identified by imaging. Monthly self-breast exams and clinical breast examinations are encouraged. Any palpable or other clinical findings should be evaluated independently of this report. If there is any persistent clinical concern, then breast surgical consultation and breast MRI with and without contrast may be considered." />
        </Section>
        </div>
      </div>
    </DialogContent>
  );
};

export default GeneralGuidelines;