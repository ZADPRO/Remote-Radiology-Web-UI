// import { Button } from '@/components/ui/button';
import React from 'react';
// import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
    // const navigate = useNavigate();

    // const items = [
    //     { label: "Add Radiologist", path: "/admin/addRadiologist" },
    //     // { label: "Add Doctor", path: "/admin/addDoctor" },
    //     { label: "Add Scribe", path: "/admin/addScribe" },
    //     { label: "Add Technician", path: "/admin/addTechnician" },
    //     { label: "Add Scan Center", path: "/admin/addScanCenter" },
    //     { label: "Add Scan Centre Admin", path: "/admin/addScanCenterAdmin" },
    //     { label: "Add Wellth Green Admin", path: "/admin/addManager" },
    //     { label: "Add Performing Provider", path: "/admin/addPerformingProvider" },
    //     { label: "Add Co-Reporting Doctor", path: "/admin/addCoReportingDoctor" },
    // ];

    // const manageItems = [
    //     { label: "Manage Radiologist", path: "/admin/manageRadiologist" },
    //     // { label: "Manage Doctor", path: "/admin/manageDoctor" },
    //     { label: "Manage Scribe", path: "/admin/manageScribe" },
    //     { label: "Manage Technician", path: "/admin/manageTechnician" },
    //     { label: "Manage Scan Center", path: "/admin/manageScanCenter" },
    //     { label: "Manage Scan Centre Admin", path: "/admin/manageScanCenterAdmin" },
    //     { label: "Manage Wellth Green Admin", path: "/admin/manageWellthGreenManager"},
    //     { label: "Manage Performing Provider", path: "/admin/managePerformingProvider" },
    //     { label: "Manage Co Reporting Doctor", path: "/admin/manageCoReportingDoctor" },
    // ];

    return (
        <div className="flex flex-col items-center py-10">
            {/* <h1 className="text-xl font-semibold mb-6 bg-green-200 text-center px-6 py-2 rounded-lg shadow-md">
                Administration
            </h1> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-4xl px-4">
                {/* <div className="flex flex-col gap-2">
                    {items.map((item) => (
                        <Button key={item.label} variant="secondary" onClick={() => navigate(item.path)} className="justify-start gap-2">
                            {/* <User className="w-4 h-4" />  */} {/*}
                            {item.label}
                        </Button>
                    ))}
                </div>
                <div className="flex flex-col gap-2">
                    {manageItems.map((item) => (
                        <Button key={item.label} variant="secondary" onClick={() => navigate(item.path)} className="justify-start gap-2">
                            {/* <User className="w-4 h-4" />  */} {/*}
                            {item.label}
                        </Button>
                    ))}
                </div> */}
            </div>
        </div>
    );
};

export default AdminDashboard;