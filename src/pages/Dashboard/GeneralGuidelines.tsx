import React from "react";
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
  );
};

export default GeneralGuidelines;