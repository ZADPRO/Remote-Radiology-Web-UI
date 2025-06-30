import React, { useMemo, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/pages/Routes/AuthContext';
import { Checkbox2 } from '@/components/ui/CustomComponents/checkbox2';

interface UserConsentProps {
    setEditingDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type RoleType =
  | 'admin'
  | 'technician'
  | 'scadmin'
  | 'patient'
  | 'doctor'
  | 'radiologist'
  | 'scribe'
  | 'codoctor'
  | 'manager';

  export const RoleDisplayNameMap: Record<RoleType, string> = {
  admin: 'Master Admin',
  technician: 'Technician',
  scadmin: 'Scan Centre Manager',
  patient: 'Patient',
  doctor: 'Doctor',
  radiologist: 'Radiologist',
  scribe: 'Scribe',
  codoctor: 'Co-Doctor',
  manager: 'Wellthgreen Manager',
};


interface RoleConsent {
  points: string[];
  agreeText: string;
}

const universalConsentPoints: { title: string; content: string }[] = [
  {
    title: 'Consent to Platform Use',
    content:
      'I hereby acknowledge that I am voluntarily registering to use the EaseQT platform for purposes directly related to clinical imaging, workflow management, or reporting.',
  },
  {
    title: 'Data Privacy & Security',
    content:
      'I understand that my personal information and any patient-related data accessed through this platform may be securely stored and processed in compliance with global privacy laws (including HIPAA, DPA 2021, and GDPR where applicable). I agree not to share, download, or misuse any protected information obtained via the platform.',
  },
  {
    title: 'Confidentiality Agreement',
    content:
      'I agree to maintain full confidentiality of any data I access, including but not limited to patient records, reports, clinical communications, and platform operations. Any breach of confidentiality may result in legal and professional consequences.',
  },
  {
    title: 'Data Consent',
    content:
      'I consent to the transfer, storage, and processing of data as necessary for platform function and continuity of care. I understand that all such data will be handled securely and only by authorized personnel.',
  },
  {
    title: 'Credential Use and Responsibility',
    content:
      'I confirm that all credentials, licenses, or certifications I provide during registration are accurate and current. I agree to keep my login credentials confidential and to notify the platform administrator of any suspected breach or unauthorized access.',
  },
  {
    title: 'Communication & Updates',
    content:
      'I consent to receiving essential updates, notifications, and communications related to the EaseQT platform via email or in-app alerts.',
  },
];

const consentByRole: Record<RoleType, RoleConsent> = {
  admin: {
    points: [
      'I understand that affixing my signature constitutes legal and clinical responsibility for the final report.',
      'I will thoroughly review all findings before signing and will reject incomplete or inaccurate entries.',
      'I am aware that my name and digital signature will appear on official reports released to patients or referring doctors.',
      'I agree to fulfill TAT expectations and ensure report completeness.',
    ],
    agreeText: 'I agree to the Admin role-specific terms.',
  },
  technician: {
    points: [
      'I certify that I have been trained in the QT Imaging acquisition protocol.',
      'I understand I am responsible for accurate image capture and proper case documentation.',
      'I will upload or transfer only complete and verified scan data for interpretation.',
      'If I am authorized to sign or attest scan quality, I will do so truthfully.',
    ],
    agreeText: 'I agree to the Technologist role-specific terms & guidelines.',
  },
  scadmin: {
    points: [
      'I am responsible for managing users, cases, or workflows within my assigned center or group.',
      'I agree to uphold security and privacy protocols in all operations.',
      'I will not access or modify clinical data outside of my administrative scope.',
    ],
    agreeText: 'I agree to the Admin role-specific terms.',
  },
  patient: {
    points: ['Patients will receive updates and may access their reports securely.'],
    agreeText: 'I agree to use the platform for receiving my medical imaging results.',
  },
  doctor: {
    points: [
      'I understand that affixing my signature constitutes legal and clinical responsibility for the final report.',
      'I will thoroughly review all findings before signing and will reject incomplete or inaccurate entries.',
      'I am aware that my name and digital signature will appear on official reports released to patients or referring doctors.',
      'I agree to fulfill TAT expectations and ensure report completeness.',
    ],
    agreeText: 'I agree to act in accordance with doctor responsibilities.',
  },
  radiologist: {
    points: [
      'I will review and input findings based on available imaging and history.',
      'I acknowledge that my reports may be reviewed or finalized by a signatory doctor.',
      "I will adhere to the platform's turnaround time (TAT) policy.",
      'I agree to collaborate respectfully with peers and escalate unclear cases as needed.',
    ],
    agreeText: 'I agree to the Co-Reporting Doctor role-specific terms.',
  },
  scribe: {
    points: [
      'I will enter clinical histories and transcribe radiologist observations with full accuracy.',
      'I understand that I am not permitted to interpret images or make clinical judgments.',
      'I will work only within assigned shifts and under the supervision of my reporting doctor.',
      'I will not retain or reuse patient information outside the EaseQT platform.',
    ],
    agreeText: 'I agree to the Scribe role-specific terms.',
  },
  codoctor: {
    points: [
      'I will review and input findings based on available imaging and history.',
      'I acknowledge that my reports may be reviewed or finalized by a signatory doctor.',
      "I will adhere to the platform's turnaround time (TAT) policy.",
      'I agree to collaborate respectfully with peers and escalate unclear cases as needed.',
    ],
    agreeText: 'I agree to the Co-Reporting Doctor role-specific terms.',
  },
  manager: {
    points: [
      'I am responsible for managing users, cases, or workflows within my assigned center or group.',
      'I agree to uphold security and privacy protocols in all operations.',
      'I will not access or modify clinical data outside of my administrative scope.',
    ],
    agreeText: 'I agree to the Admin role-specific terms.',
  },
};

const UserConsent: React.FC<UserConsentProps> = ({ setEditingDialogOpen }) => {
  const { role } = useAuth();

  const userRoleType = role?.type as RoleType;
const userRole = userRoleType ? RoleDisplayNameMap[userRoleType] : "Guest";
  const roleConsent = useMemo(() => {
    return consentByRole[userRoleType] ?? {
      points: [],
      agreeText: '',
    };
  }, [userRoleType]);

  const [isUniversalChecked, setUniversalChecked] = useState(false);
  const [isRoleChecked, setRoleChecked] = useState(false);

  const handleSubmit = () => {
    setEditingDialogOpen(false);
    console.log('Consent submitted for role:', userRole);
  };

  return (
    <form onSubmit={(e) => {e.preventDefault(); handleSubmit()}} className="p-5 lg:p-10 mx-5 lg:mx-10 mb-2 border-2 border-gray-300 rounded-2xl shadow-2xl">
      {/* Universal Consent */}
      <div className="text-sm leading-relaxed space-y-6">
        {universalConsentPoints.map((point, idx) => (
          <div className="flex flex-col gap-1">
            <h2 className="text-xl lg:text-2xl font-semibold ">
              {`${idx + 1}. ` + point.title}
            </h2>
            <span className="ml-1 lg:ml-6 text-base" key={idx}>
              {point.content}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center space-x-2 mt-4">
        <Checkbox2
        className='bg-pink-300'
          checked={isUniversalChecked}
          onCheckedChange={(val) => setUniversalChecked(!!val)}
          required
        />
        <Label className="text-sm cursor-pointer">
          I agree to the above universal terms and policies.
        </Label>
      </div>

      {/* Role-specific Consent */}
      {roleConsent.points.length > 0 && (
        <>
          <h2 className="text-xl lg:text-2xl font-semibold mt-6 capitalize">
            {'7.  '+userRole} Consent
          </h2>
          <div className="leading-relaxed space-y-4">
            {roleConsent.points.map((point, idx) => (
              <li className='ml-1 lg:ml-6 text-base' key={idx}>{point}</li>
            ))}
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <Checkbox2
            className='bg-pink-300'
              checked={isRoleChecked}
              onCheckedChange={(val) => setRoleChecked(!!val)}
              required
            />
            <Label className="text-sm cursor-pointer">
              {roleConsent.agreeText}
            </Label>
          </div>
        </>
      )}

      <div className="flex justify-end mt-8">
        <Button
          className="bg-[#f0d9d3] hover:bg-[#ebcbc2] text-[##3F3F3D] border-1 border-[#3F3F3D] rounded-lg px-6 py-2"
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

export default UserConsent;