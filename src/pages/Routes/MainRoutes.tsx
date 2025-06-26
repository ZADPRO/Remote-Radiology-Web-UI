import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "../Login/Login";
import VerifyOTP from "../Login/VerifyOTP";
import { AuthProvider } from "./AuthContext";
import RoleProtectedRoute from "./RoleProtectedRoute";
import MasterAdmin from "../Dashboard/MasterAdmin";
import AdminDashboard from "../Dashboard/AdminDashboard";
import AddTechnician from "../AddTechnician/AddTechnician";
import AddScanCenter from "../AddScanCenter/AddScanCenter";
import ForgotPasword from "../ForgotPassword/ForgotPasword";
import ManageScanCenter from "../ManageScanCenter/ManageScanCenter";
import ViewScanCenter from "../ViewScanCenter/ViewScanCenter";
import AddReceptionist from "../AddReceptionist/AddReceptionist";
import SignUp from "../SignUp/SignUp";
import ResetPassword from "../Login/ResetPassword";
import AddRadiologist from "../AddRadiologist/AddRadiologist";
import ManageRadiologist from "../ManageRadiologist/ManageRadiologist";
import AddScanCenterAdmin from "../AddScanCenterAdmin/AddScanCenterAdmin";
import AddDoctor from "../AddDoctor/AddDoctor";
import AddScribe from "../AddScribe/AddScribe";
import AddManager from "../AddWellthGreenManager/AddManager";
import AddPerformingProvider from "../AddPerformingProvider/AddPerformingProvider";
import AddCoReportingDoctor from "../AddCoReportingDoctor/AddCoReportingDoctor";
import ManageScribe from "../ManageScribe/ManageScribe";
import ManageScanCenterAdmin from "../ManageScanCenterAdmin/ManageScanCenterAdmin";
import ManageTechnician from "../ManageTechnician/ManageTechnician";
import ManageWellthGreenAdmin from "../ManageWellthGreenManager/ManageWellthGreenManager";
import ManagePerformingProvider from "../ManagePerformingProvider/ManagePerformingProvider";
import Administration from "../Administration/Administration";
import MainInTakeForm from "../PatientInTakeForm/MainInTakeForm";
import PatientInTakeForm01 from "../PatientInTakeForm/PatientInTakeForm01";
import SamplePage from "../SamplePage";
import PatientInTakeForm04 from "../PatientInTakeForm/PatientInTakeFormDC/PatientInTakeForm04";
import PatientInTakeForm02 from "../PatientInTakeForm/PatientInTakeFormDa/PatientInTakeForm02";
import PatientInTakeForm03 from "../PatientInTakeForm/PatientInTakeFormDb/PatientInTakeForm03";
import ManageCoReportingDoctor from "../ManageCoReportingDoctor/ManageCoReportingDoctor";
import TechnologistPatientInTakeForm from "../TechnologistPatientInTakeForm/TechnologistPatientInTakeForm";

const MainRoutes: React.FC = () => {
  return (
      <Router>
            <AuthProvider>

        <Routes>
          <Route index element={<Login />} />
          <Route path="mainInTakeForm" element={<MainInTakeForm />} />
          <Route path="patientInTakeForm-01" element={<PatientInTakeForm01 />} />
          <Route path="patientInTakeForm-02" element={<PatientInTakeForm02 />} />
          <Route path="patientInTakeForm-03" element={<PatientInTakeForm03 />} />
          <Route path="patientInTakeForm-04" element={<PatientInTakeForm04 />} />
          <Route path="technologistForm" element={<TechnologistPatientInTakeForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/resetPass" element={<ResetPassword />} />
          <Route path="/verifyOtp" element={<VerifyOTP />} />
          <Route path="/forgotPassword" element={<ForgotPasword />} />
          <Route path="/registerUser" element={<SignUp />} />
          <Route path="/addReceptionist" element={<AddReceptionist />} />
          <Route path="/sample"  element={<SamplePage />} />

          <Route
            path="/admin"
            element={
              <RoleProtectedRoute allowedRoles={["admin"]}>
                <MasterAdmin />
              </RoleProtectedRoute>
            }
          >
            <Route index element={<Navigate to="administration" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="administration" element={<Administration />} />
            <Route path="addScanCenter" element={<AddScanCenter />} />
            <Route path="viewScanCenter/:id" element={<ViewScanCenter />} />
            <Route path="addRadiologist" element={<AddRadiologist />} />
            <Route path="manageScanCenter" element={<ManageScanCenter />} />
            <Route path="viewScanCenter/:id" element={<ViewScanCenter />} />
            <Route path="manageRadiologist" element={<ManageRadiologist />} />
            <Route path="addScanCenterAdmin" element={<AddScanCenterAdmin />} />
            <Route path="addTechnician" element={<AddTechnician />} />
            <Route path="addDoctor" element={<AddDoctor />} />
            <Route path="addScribe" element={<AddScribe />} />
            <Route path="addManager" element={<AddManager />} />
            <Route
              path="addPerformingProvider"
              element={<AddPerformingProvider />}
            />
            <Route
              path="addCoReportingDoctor"
              element={<AddCoReportingDoctor />}
            />
            <Route path="manageScribe" element={<ManageScribe />} />
            <Route
              path="manageScanCenterAdmin"
              element={<ManageScanCenterAdmin />}
            />
            <Route path="manageTechnician" element={<ManageTechnician />} />
            <Route
              path="manageWellthGreenManager"
              element={<ManageWellthGreenAdmin />}
            />
            <Route
              path="managePerformingProvider"
              element={<ManagePerformingProvider />}
            />
            <Route
              path="manageCoReportingDoctor"
              element={<ManageCoReportingDoctor />}
            />
          </Route>

          <Route
            path="/scadmin"
            element={
              <RoleProtectedRoute allowedRoles={["scadmin"]}>
                <MasterAdmin />
              </RoleProtectedRoute>
            }
          >
            <Route index element={<Navigate to="administration" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="administration" element={<Administration />} />
            <Route path="manageScanCenter" element={<ManageScanCenter />} />
          </Route>

          <Route
            path="/manager"
            element={
              <RoleProtectedRoute allowedRoles={["manager"]}>
                <MasterAdmin />
              </RoleProtectedRoute>
            }
          >
            <Route index element={<Navigate to="administration" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="administration" element={<Administration />} />
          </Route>
        </Routes>
            </AuthProvider>

      </Router>
  );
};

export default MainRoutes;
