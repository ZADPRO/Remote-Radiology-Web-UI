import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import RoleProtectedRoute from "./RoleProtectedRoute";

// Authentication Components
import Login from "../Login/Login";
import VerifyOTP from "../Login/VerifyOTP";
import ForgotPasword from "../ForgotPassword/ForgotPasword";
import SignUp from "../SignUp/SignUp";
import ResetPassword from "../Login/ResetPassword";

// Dashboard and Core Admin Components
import MasterAdmin from "../Dashboard/MasterAdmin";
import AdminDashboard from "../Dashboard/AdminDashboard";
import Administration from "../Administration/Administration";
import MyCare from "../PatientFlow/MyCare";

// Patient Intake Forms
import MainInTakeForm from "../PatientInTakeForm/MainInTakeForm";
import PatientInTakeForm01 from "../PatientInTakeForm/PatientInTakeFormS/PatientInTakeForm01";
import PatientInTakeForm02 from "../PatientInTakeForm/PatientInTakeFormDa/PatientInTakeForm02";
import PatientInTakeForm03 from "../PatientInTakeForm/PatientInTakeFormDb/PatientInTakeForm03";
import PatientInTakeForm04 from "../PatientInTakeForm/PatientInTakeFormDC/PatientInTakeForm04";
import TechnicianPatientIntakeForm from "../TechnicianPatientIntakeForm/TechnicianPatientIntakeForm";

// User Management Components
import AddTechnician from "../AddTechnician/AddTechnician";
import ManageTechnician from "../ManageTechnician/ManageTechnician";
import AddScanCenter from "../AddScanCenter/AddScanCenter";
import ManageScanCenter from "../ManageScanCenter/ManageScanCenter";
import ViewScanCenter from "../ViewScanCenter/ViewScanCenter";
import AddRadiologist from "../AddRadiologist/AddRadiologist";
import ManageRadiologist from "../ManageRadiologist/ManageRadiologist";
import AddScanCenterAdmin from "../AddScanCenterAdmin/AddScanCenterAdmin";
import ManageScanCenterAdmin from "../ManageScanCenterAdmin/ManageScanCenterAdmin";
import AddScribe from "../AddScribe/AddScribe";
import ManageScribe from "../ManageScribe/ManageScribe";
import AddManager from "../AddWellthGreenManager/AddManager";
import ManageWellthGreenAdmin from "../ManageWellthGreenManager/ManageWellthGreenManager";
import AddPerformingProvider from "../AddPerformingProvider/AddPerformingProvider";
import ManagePerformingProvider from "../ManagePerformingProvider/ManagePerformingProvider";
import AddCoReportingDoctor from "../AddCoReportingDoctor/AddCoReportingDoctor";
import ManageCoReportingDoctor from "../ManageCoReportingDoctor/ManageCoReportingDoctor";
import MedicalHistory from "../PatientFlow/MedicalHistory";
import PatientQueue from "../TechnicianFlow/PatientQueue";

// Define a type for route configurations to improve readability and type safety
interface AppRoute {
  path?: string; // Made path optional
  element: React.ReactNode;
  index?: boolean;
  children?: AppRoute[];
  allowedRoles?: string[]; // Only for RoleProtectedRoute
  redirectTo?: string; // For Navigate component
}

const MainRoutes: React.FC = () => {

  const adminRoutes: AppRoute[] = [
    { index: true, element: <Navigate to="administration" replace /> },
    { path: "dashboard", element: <AdminDashboard /> },
    { path: "administration", element: <Administration /> },
    { path: "addScanCenter", element: <AddScanCenter /> },
    { path: "viewScanCenter/:id", element: <ViewScanCenter /> },
    { path: "addRadiologist", element: <AddRadiologist /> },
    { path: "addScanCenterAdmin", element: <AddScanCenterAdmin /> },
    { path: "addTechnician", element: <AddTechnician /> },
    { path: "addScribe", element: <AddScribe /> },
    { path: "addManager", element: <AddManager /> },
    { path: "addPerformingProvider", element: <AddPerformingProvider /> },
    { path: "addCoReportingDoctor", element: <AddCoReportingDoctor /> },
    { path: "manageScanCenter", element: <ManageScanCenter /> },
    { path: "manageRadiologist", element: <ManageRadiologist /> },
    { path: "manageScribe", element: <ManageScribe /> },
    { path: "manageScanCenterAdmin", element: <ManageScanCenterAdmin /> },
    { path: "manageTechnician", element: <ManageTechnician /> },
    { path: "manageWellthGreenManager", element: <ManageWellthGreenAdmin /> },
    { path: "managePerformingProvider", element: <ManagePerformingProvider /> },
    { path: "manageCoReportingDoctor", element: <ManageCoReportingDoctor /> },
  ];

  const scAdminRoutes: AppRoute[] = [
    { index: true, element: <Navigate to="administration" replace /> },
    { path: "dashboard", element: <AdminDashboard /> },
    { path: "administration/:id", element: <ViewScanCenter /> },
    { path: "manageTechnician", element: <ManageTechnician /> },
    { path: "managePerformingProvider", element: <ManagePerformingProvider /> },
    { path: "manageCoReportingDoctor", element: <ManageCoReportingDoctor /> },
    { path: "addTechnician", element: <AddTechnician /> },
    { path: "addPerformingProvider", element: <AddPerformingProvider /> },
    { path: "addCoReportingDoctor", element: <AddCoReportingDoctor /> },
  ];

  const technicianRoutes: AppRoute[] = [
    { index: true, element: <Navigate to="dashboard" replace /> },
    { path: "dashboard", element: <AdminDashboard /> },
    { path: "patientQueue", element: <PatientQueue />}
  ];

  const doctorRoutes: AppRoute[] = [
    { index: true, element: <Navigate to="dashboard" replace /> },
    { path: "dashboard", element: <AdminDashboard /> },
  ]

  const radiologistRoutes: AppRoute[] = [
    { index: true, element: <Navigate to="dashboard" replace /> },
    { path: "dashboard", element: <AdminDashboard /> },
  ]

  const scribeRoutes: AppRoute[] = [
    { index: true, element: <Navigate to="dashboard" replace /> },
    { path: "dashboard", element: <AdminDashboard /> },
  ]

  const coDoctorRoutes: AppRoute[] = [
    { index: true, element: <Navigate to="dashboard" replace /> },
    { path: "dashboard", element: <AdminDashboard /> },
  ]

  const managerRoutes: AppRoute[] = [
    { index: true, element: <Navigate to="administration" replace /> },
    { path: "dashboard", element: <AdminDashboard /> },
    { path: "administration", element: <Administration /> },
    { path: "manageRadiologist", element: <ManageRadiologist /> },
    { path: "addRadiologist", element: <AddRadiologist /> },
    { path: "addScribe", element: <AddScribe /> },
    { path: "manageScribe", element: <ManageScribe /> },
    { path: "viewScanCenter", element: <ViewScanCenter /> },
  ];

  const patientRoutes: AppRoute[] = [
    { index: true, element: <Navigate to="myCare" replace /> },
    { path: "dashboard", element: <AdminDashboard /> },
    { path: "myCare", element: <MyCare /> },
    { path: "medicalHistory", element: <MedicalHistory />},
  ];

  // Helper function to render routes, applying RoleProtectedRoute when needed
  const renderRoutes = (routes: AppRoute[]) => {
    return routes.map((route, index) => {
      const Element = route.element;
      if (route.allowedRoles) {
        return (
          <Route
            key={index}
            path={route.path}
            element={
              <RoleProtectedRoute allowedRoles={route.allowedRoles}>
                {Element}
              </RoleProtectedRoute>
            }
          >
            {route.children && renderRoutes(route.children)}
          </Route>
        );
      } else if (route.redirectTo) {
        return <Route key={index} path={route.path} element={<Navigate to={route.redirectTo} replace />} />;
      } else if (route.children) {
        return (
          <Route key={index} path={route.path} element={Element}>
            {renderRoutes(route.children)}
          </Route>
        );
      }
      return <Route key={index} path={route.path} element={Element} index={route.index} />;
    });
  };

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route index element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/resetPass" element={<ResetPassword />} />
          <Route path="/verifyOtp" element={<VerifyOTP />} />
          <Route path="/forgotPassword" element={<ForgotPasword />} />
          <Route path="/registerUser" element={<SignUp />} />

          {/* Patient Intake Forms (Accessible without specific roles, or role handling is internal to the forms) */}
          <Route path="mainInTakeForm" element={<MainInTakeForm />} />
          <Route
            path="patientInTakeForm-01"
            element={<PatientInTakeForm01 />}
          />
          <Route
            path="patientInTakeForm-02"
            element={<PatientInTakeForm02 />}
          />
          <Route
            path="patientInTakeForm-03"
            element={<PatientInTakeForm03 />}
          />
          <Route
            path="patientInTakeForm-04"
            element={<PatientInTakeForm04 />}
          />
          <Route
            path="technicianpatientintakeform"
            element={<TechnicianPatientIntakeForm />}
          />

          {/* Protected Routes */}
          <Route
            path="/admin"
            element={
              <RoleProtectedRoute allowedRoles={["admin"]}>
                <MasterAdmin />
              </RoleProtectedRoute>
            }
          >
            {renderRoutes(adminRoutes)}
          </Route>

          <Route
            path="/scadmin"
            element={
              <RoleProtectedRoute allowedRoles={["scadmin"]}>
                <MasterAdmin />
              </RoleProtectedRoute>
            }
          >
            {renderRoutes(scAdminRoutes)}
          </Route>

          <Route
            path="/technician"
            element={
              <RoleProtectedRoute allowedRoles={["technician"]}>
                <MasterAdmin />
              </RoleProtectedRoute>
            }
          >
            {renderRoutes(technicianRoutes)}
          </Route>

          <Route
            path="/doctor"
            element={
              <RoleProtectedRoute allowedRoles={["doctor"]}>
                <MasterAdmin />
              </RoleProtectedRoute>
            }
          >
            {renderRoutes(doctorRoutes)}
          </Route>

          <Route
            path="/radiologist"
            element={
              <RoleProtectedRoute allowedRoles={["radiologist"]}>
                <MasterAdmin />
              </RoleProtectedRoute>
            }
          >
            {renderRoutes(radiologistRoutes)}
          </Route>

          <Route
            path="/scribe"
            element={
              <RoleProtectedRoute allowedRoles={["scribe"]}>
                <MasterAdmin />
              </RoleProtectedRoute>
            }
          >
            {renderRoutes(scribeRoutes)}
          </Route>

          <Route
            path="/codoctor"
            element={
              <RoleProtectedRoute allowedRoles={["codoctor"]}>
                <MasterAdmin />
              </RoleProtectedRoute>
            }
          >
            {renderRoutes(coDoctorRoutes)}
          </Route>

          <Route
            path="/manager"
            element={
              <RoleProtectedRoute allowedRoles={["manager"]}>
                <MasterAdmin />
              </RoleProtectedRoute>
            }
          >
            {renderRoutes(managerRoutes)}
          </Route>

          <Route
            path="/patient"
            element={
              <RoleProtectedRoute allowedRoles={["patient"]}>
                <MasterAdmin />
              </RoleProtectedRoute>
            }
          >
            {renderRoutes(patientRoutes)}
          </Route>

          {/* Catch-all for undefined routes (optional, but good practice) */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default MainRoutes;