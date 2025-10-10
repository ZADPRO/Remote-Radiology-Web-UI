import React from "react";
import { Dot } from "lucide-react";

const Disclaimer: React.FC = () => {
  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-[#e9e7e3] shadow mx-3 lg:mx-10 mt-6 rounded-md p-5">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="space-y-2 text-sm text-justify">{children}</div>
    </div>
  );

  const ListItem = ({ text }: { text: string }) => (
    <div className="flex items-start gap-2">
      <div className="mt-[2px]">
        <Dot className="w-4 h-4" />
      </div>
      <div>{text}</div>
    </div>
  );

  return (
   

      <div className="w-full h-auto mx-auto px-5 lg:px-10">
            <div className="border-2 border-gray-300 rounded-2xl shadow-2xl">
        <Section title="Device Information and Regulatory Status">
          <ListItem text="The QT Scanner is FDA-cleared (510(k)) as an ultrasonic breast imaging system for use in adult women aged 18 years or older." />
          <ListItem text="This device is FDA-cleared, not FDA-approved. The 510(k) clearance does not constitute FDA endorsement of the device." />
        </Section>

        <Section title="Intended Use and Clinical Application">
          <ListItem text="Adjunct Diagnostic Tool: The QT Scanner is intended for use as a supplemental imaging tool and is not a replacement for screening mammography." />
          <ListItem text="Prescription Use Only: This device is indicated for prescription use by trained healthcare professionals in clinical settings." />
          <ListItem text="Dual-Mode Imaging: Provides both reflection-mode and transmission-mode 3D images of breast tissue." />
          <ListItem text="Quantitative Metrics: FDA-cleared to calculate fibroglandular tissue volume (FGV) and ratio of FGV to total breast volume (TBV) for breast composition assessment." />
        </Section>

        <Section title="Important Limitations and Restrictions">
          <p className="italic text-xs text-gray-600">Clinical Limitations</p>
          <ListItem text="Not a Standalone Screening Tool: This device cannot independently detect cancer or serve as a sole screening solution." />
          <ListItem text="Cannot Replace Mammography: All patients should continue routine mammography screening as recommended by their healthcare provider." />
          <ListItem text="Adjunct Use Only: Results should be interpreted in conjunction with other clinical findings and imaging studies." />

          <p className="italic text-xs text-gray-600 mt-2">Regulatory Compliance</p>
          <ListItem text="FDA-Cleared Indications Only: Use is restricted to FDA-cleared indications for breast imaging in adult women." />
          <ListItem text="No Off-Label Claims: This report does not promote uses beyond the device's FDA-cleared indications." />
          <ListItem text="Clinical Decision-Making: Healthcare professionals retain full responsibility for clinical interpretation and decision-making based on imaging results." />
        </Section>

        <Section title="Technology Characteristics">
          <ListItem text="Ultrasound Technology: Uses safe, radiation-free ultrasound imaging." />
          <ListItem text="Compression-Free: Examination does not require breast compression." />
          <ListItem text="No Contrast Required: Does not require injection of contrast agents." />
          <ListItem text="3D Imaging Capability: Provides comprehensive visualization of breast tissue structure." />
        </Section>

        <Section title="Professional Responsibility">
          <ListItem text="Healthcare professionals using this device and interpreting results must be appropriately trained in the use of the QT Scanner." />
          <ListItem text="Interpret results within the context of the patient's complete clinical picture." />
          <ListItem text="Maintain compliance with FDA-cleared indications and limitations." />
          <ListItem text="Continue to follow established breast cancer screening guidelines." />
        </Section>

        <div className="mx-3 lg:mx-10 mt-6 mb-6 rounded-md p-5 text-sm italic text-gray-700">
          This disclaimer is based on FDA 510(k) clearance requirements and regulatory guidance. For complete device specifications and clinical indications, refer to the FDA-cleared labeling and instructions for use.
        </div>
      </div>
      </div>
  );
};

export default Disclaimer;