import React from "react";
import { DialogContent, DialogHeader } from "@/components/ui/dialog";
import logoNew from "../../assets/LogoNew.png";
import { CircleSmall } from "lucide-react";

const TechGuidelines: React.FC = () => {
  return (
    <DialogContent
      style={{
        background:
          "radial-gradient(100.97% 186.01% at 50.94% 50%, #F9F4EC 25.14%, #EED8D6 100%)",
      }}
      className="w-[100vw] h-[90vh] lg:w-[70vw] overflow-y-auto p-0"
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
          <h2 className="text-2xl font-semibold">QT Technologist Guidelines</h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            Wellthgreen Report Portal Platform
          </p>
        </div>

        {/* Spacer to balance logo width */}
        <div className="hidden lg:inline h-12 w-24 sm:h-14 sm:w-28 flex-shrink-0" />
      </DialogHeader>
      <div className="w-full h-auto mx-auto px-5 lg:px-10">
        <div className="border-2 border-gray-300 rounded-2xl shadow-2xl">
          <div className="bg-[#e9e7e3] shadow-sm mx-3 lg:mx-10 mt-5 rounded-md p-6">
            <div className="text-lg mb-[1rem] font-semibold">
              Pre-Scan Requirements
            </div>
            <div className="text-sm flex gap-3 font-normal text-justify">
              <div>1.</div>
              <div>Verify Training and Certification</div>
            </div>
            {[
              "Ensure you are a trained healthcare professional authorized to operate QT imaging equipment",
              "Confirm current competency for QT Scanner",
              "Maintain ongoing education requirements as specified by your institution",
            ].map((data) => (
              <>
                <div className="ml-3 flex items-center gap-2 mt-[0.4rem] text-sm font-normal text-justify">
                  <div className="text-xs">
                    <CircleSmall />
                  </div>
                  <div>{data}</div>
                </div>
              </>
            ))}
            <div className="">
              <div className="text-sm flex mb-3 gap-3 mt-4 font-normal text-justify">
                <div>2.</div>
                <div>Understand FDA-Approved Scope of Practice</div>
              </div>
              {[
                "Primary Function: Supplementary breast imaging tool (NOT a mammography replacement)",
                "Approved Uses:",
                "Special Designation: Breakthrough Device status for asymptomatic women at above-average breast cancer risk",
                "Patient Screening and Selection",
              ].map((data) => (
                <>
                  <div className="ml-3 flex flex-col text-sm font-normal text-start">
                    <div className="flex flex-row items-center gap-2">
                      <div className="text-xs">
                        <CircleSmall />
                      </div>
                      <div>{data}</div>
                    </div>
                    <div>
                      {data === "Approved Uses:" && (
                        <div className="mt-2 mb-2 ml-7">
                          {[
                            "• Reflection-mode and transmission-mode ultrasound imaging of the breast",
                            "• Fibroglandular tissue volume (FGV) assessment",
                            "• FGV-to-total breast volume (TBV) ratio calculations",
                          ].map((subdata) => (
                            <div>{subdata}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>

          <div className="bg-[#e9e7e3] shadow-sm mx-3 lg:mx-10 mt-5 rounded-md p-6">
            <div className="text-lg mb-[1rem] font-semibold">
              Required Patient Assessment Checklist
            </div>
            <div className="text-sm flex gap-3 font-normal text-justify">
              <div>1.</div>
              <div>Inclusion Criteria - Patient MUST Meet ALL:</div>
            </div>
            {[
              "Female patient over 18 years of age",
              "Breast size DDD cup or smaller",
              "Weight 350 lbs or less",
              "Able to lie flat comfortably for minimum 15 minutes",
              "Scan indication falls within FDA-approved uses",
            ].map((data) => (
              <>
                <div className="ml-3 flex items-center gap-2 mt-[0.4rem] text-sm font-normal text-justify">
                  <div className="text-xs">
                    <CircleSmall />
                  </div>
                  <div>{data}</div>
                </div>
              </>
            ))}
            
            <div className="">
              <div className="text-sm flex mb-3 gap-3 mt-4 font-normal text-justify">
                <div>2.</div>
                <div>Relative Contraindications - Assess Carefully:</div>
              </div>
              {[
                "Pregnancy (any trimester)",
                "Currently lactating/breastfeeding",
                "Open wounds or lesions on breast skin",
                "Severe mobility limitations preventing proper positioning",
                "Tremors or involuntary movements",
                "Persistent coughing or breathing difficulties",
                "Claustrophobia or anxiety about enclosed spaces",
                "Recent breast surgery (consult with ordering physician)",
              ].map((data) => (
                <>
                  <div className="ml-3 flex flex-col text-sm font-normal text-start">
                    <div className="flex flex-row items-center gap-2">
                      <div className="text-xs">
                        <CircleSmall />
                      </div>
                      <div>{data}</div>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>

          <div className="bg-[#e9e7e3] shadow-sm mx-3 lg:mx-10 mt-5 rounded-md p-6">
            <div className="text-lg mb-[1rem] font-semibold">
              Pre-Scan Patient Preparation
            </div>
            <div className="text-sm flex gap-3 font-normal text-justify">
              <div>1.</div>
              <div>Patient Education</div>
            </div>
            {[
              "Explain that QT imaging is a supplementary tool, not a replacement for mammography",
              "Describe the procedure: patient lies prone, breasts positioned in water-filled chambers",
              "Inform patient of approximate scan time (15+ minutes)",
              "Able to lie flat comfortably for minimum 15 minutes",
              "Address any questions or concerns about the procedure",
            ].map((data) => (
              <>
                <div className="ml-3 flex items-center gap-2 mt-[0.4rem] text-sm font-normal text-justify">
                  <div className="text-xs">
                    <CircleSmall />
                  </div>
                  <div>{data}</div>
                </div>
              </>
            ))}
            <div className="">
              <div className="text-sm flex mb-3 gap-3 mt-4 font-normal text-justify">
                <div>2.</div>
                <div>Consent and Documentation</div>
              </div>
              {[
                "Obtain informed consent according to institutional protocols",
                "Document patient's understanding of supplementary nature of exam",
                "Record any relevant medical history or contraindications assessed",
              ].map((data) => (
                <>
                  <div className="ml-3 flex flex-col text-sm font-normal text-start">
                    <div className="flex flex-row items-center gap-2">
                      <div className="text-xs">
                        <CircleSmall />
                      </div>
                      <div>{data}</div>
                    </div>
                  </div>
                </>
              ))}
            </div>
            <div className="">
              <div className="text-sm flex mb-3 gap-3 mt-4 font-normal text-justify">
                <div>3.</div>
                <div>Physical Preparation</div>
              </div>
              {[
                "Ensure patient removes all jewelry, clothing, and bras from chest area",
                "Provide appropriate gowning for patient comfort and dignity",
                "Verify patient can assume and maintain prone position comfortably",
              ].map((data) => (
                <>
                  <div className="ml-3 flex flex-col text-sm font-normal text-start">
                    <div className="flex flex-row items-center gap-2">
                      <div className="text-xs">
                        <CircleSmall />
                      </div>
                      <div>{data}</div>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>

          <div className="bg-[#e9e7e3] shadow-sm mx-3 lg:mx-10 mt-5 rounded-md p-6">
            <div className="text-lg mb-[1rem] font-semibold">
              Equipment Preparation and Safety
            </div>
            <div className="text-sm flex gap-3 font-normal text-justify">
              <div>1.</div>
              <div>Water System Management</div>
            </div>
            {[
              "Verify water temperature is appropriate for patient comfort",
              "Ensure water quality meets safety standards & QT scanner guidelines",
              "Special Protocol: If patient has nipple discharge, change water after scanning to maintain hygiene and safety",
            ].map((data) => (
              <>
                <div className="ml-3 flex items-center gap-2 mt-[0.4rem] text-sm font-normal text-justify">
                  <div className="text-xs">
                    <CircleSmall />
                  </div>
                  <div>{data}</div>
                </div>
              </>
            ))}
            <div className="">
              <div className="text-sm flex mb-3 gap-3 mt-4 font-normal text-justify">
                <div>2.</div>
                <div>System Checks</div>
              </div>
              {[
                "Complete pre-scan equipment calibration per manufacturer specifications",
                "Verify all safety systems are functioning properly",
                "Ensure emergency protocols are readily accessible",
              ].map((data) => (
                <>
                  <div className="ml-3 flex flex-col text-sm font-normal text-start">
                    <div className="flex flex-row items-center gap-2">
                      <div className="text-xs">
                        <CircleSmall />
                      </div>
                      <div>{data}</div>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>

          <div className="bg-[#e9e7e3] shadow-sm mx-3 lg:mx-10 mt-5 rounded-md p-6">
            <div className="text-lg mb-[1rem] font-semibold">
              Scan Protocol Guidelines
            </div>
            <div className="text-sm flex gap-3 font-normal text-justify">
              <div>1.</div>
              <div>Patient Positioning</div>
            </div>
            {[
              "Assist patient into prone position on scanning table",
              "Ensure proper breast positioning in imaging chambers",
              "Verify patient comfort and ability to remain still for scan duration",
              "Provide communication method for patient during scan",
            ].map((data) => (
              <>
                <div className="ml-3 flex items-center gap-2 mt-[0.4rem] text-sm font-normal text-justify">
                  <div className="text-xs">
                    <CircleSmall />
                  </div>
                  <div>{data}</div>
                </div>
              </>
            ))}
            <div className="">
              <div className="text-sm flex mb-3 gap-3 mt-4 font-normal text-justify">
                <div>2.</div>
                <div>Image Acquisition Standards</div>
              </div>
              {[
                "Acquire both reflection-mode and transmission-mode images as indicated",
                "Ensure adequate image quality for fibroglandular tissue assessment",
                "Document any technical difficulties or patient motion artifacts",
              ].map((data) => (
                <>
                  <div className="ml-3 flex flex-col text-sm font-normal text-start">
                    <div className="flex flex-row items-center gap-2">
                      <div className="text-xs">
                        <CircleSmall />
                      </div>
                      <div>{data}</div>
                    </div>
                  </div>
                </>
              ))}
            </div>
            <div className="">
              <div className="text-sm flex mb-3 gap-3 mt-4 font-normal text-justify">
                <div>3.</div>
                <div>Quality Assurance During Scan</div>
              </div>
              {[
                "Monitor patient comfort and tolerance throughout procedure",
                "Watch for signs of patient distress or inability to continue",
                "Maintain communication with patient during scanning process",
              ].map((data) => (
                <>
                  <div className="ml-3 flex flex-col text-sm font-normal text-start">
                    <div className="flex flex-row items-center gap-2">
                      <div className="text-xs">
                        <CircleSmall />
                      </div>
                      <div>{data}</div>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>

          <div className="bg-[#e9e7e3] shadow-sm mx-3 lg:mx-10 mt-5 rounded-md p-6">
            <div className="text-lg mb-[1rem] font-semibold">
              Post-Scan Protocols
            </div>
            <div className="text-sm flex gap-3 font-normal text-justify">
              <div>1.</div>
              <div>Patient Care</div>
            </div>
            {[
              "Assist patient from scanning table safely",
              "Provide towels and privacy for patient cleanup",
              "Ensure patient comfort before discharge from imaging area",
            ].map((data) => (
              <>
                <div className="ml-3 flex items-center gap-2 mt-[0.4rem] text-sm font-normal text-justify">
                  <div className="text-xs">
                    <CircleSmall />
                  </div>
                  <div>{data}</div>
                </div>
              </>
            ))}
            <div className="">
              <div className="text-sm flex mb-3 gap-3 mt-4 font-normal text-justify">
                <div>2.</div>
                <div>Image Review and Documentation</div>
              </div>
              {[
                "Perform initial technical quality assessment of images",
                "Document scan completion and any technical notes",
                "Ensure proper image storage and transmission to interpreting physician",
              ].map((data) => (
                <>
                  <div className="ml-3 flex flex-col text-sm font-normal text-start">
                    <div className="flex flex-row items-center gap-2">
                      <div className="text-xs">
                        <CircleSmall />
                      </div>
                      <div>{data}</div>
                    </div>
                  </div>
                </>
              ))}
            </div>
            <div className="">
              <div className="text-sm flex mb-3 gap-3 mt-4 font-normal text-justify">
                <div>3.</div>
                <div>Equipment Maintenance</div>
              </div>
              {[
                "Clean and sanitize equipment according to protocols",
                "Change water system if indicated (nipple discharge cases)",
                "Document equipment function and any maintenance needs",
              ].map((data) => (
                <>
                  <div className="ml-3 flex flex-col text-sm font-normal text-start">
                    <div className="flex flex-row items-center gap-2">
                      <div className="text-xs">
                        <CircleSmall />
                      </div>
                      <div>{data}</div>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>

          <div className="bg-[#e9e7e3] shadow-sm mx-3 lg:mx-10 mt-5 rounded-md p-6">
            <div className="text-lg mb-[1rem] font-semibold">
              Professional Responsibilities
            </div>
            <div className="text-sm flex gap-3 font-normal text-justify">
              <div>1.</div>
              <div>Scope of Practice Limitations</div>
            </div>
            {[
              "DO NOT interpret images or provide diagnostic information to patients",
              "DO NOT suggest QT imaging can replace standard mammography screening",
              // "DO NOT exceed FDA-approved indications for scanning",
            ].map((data) => (
              <>
                <div className="ml-3 flex items-center gap-2 mt-[0.4rem] text-sm font-normal text-justify">
                  <div className="text-xs">
                    <CircleSmall />
                  </div>
                  <div>{data}</div>
                </div>
              </>
            ))}
            <div className="">
              <div className="text-sm flex mb-3 gap-3 mt-4 font-normal text-justify">
                <div>2.</div>
                <div>Communication Guidelines</div>
              </div>
              {[
                "Refer all clinical questions to the interpreting radiologist",
                "Inform patients that results will be provided by their ordering physician",
                "Document and report any adverse events or equipment malfunctions immediately",
              ].map((data) => (
                <>
                  <div className="ml-3 flex flex-col text-sm font-normal text-start">
                    <div className="flex flex-row items-center gap-2">
                      <div className="text-xs">
                        <CircleSmall />
                      </div>
                      <div>{data}</div>
                    </div>
                  </div>
                </>
              ))}
            </div>
            <div className="">
              <div className="text-sm flex mb-3 gap-3 mt-4 font-normal text-justify">
                <div>3.</div>
                <div>Continuing Education</div>
              </div>
              {[
                "Stay current with QT imaging technology updates and protocol changes",
                "Participate in required continuing education programs",
                "Maintain awareness of evolving FDA approvals and restrictions",
              ].map((data) => (
                <>
                  <div className="ml-3 flex flex-col text-sm font-normal text-start">
                    <div className="flex flex-row items-center gap-2">
                      <div className="text-xs">
                        <CircleSmall />
                      </div>
                      <div>{data}</div>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>

          <div className="bg-[#e9e7e3] shadow-sm mx-3 lg:mx-10 mt-5 rounded-md p-6">
            <div className="text-lg mb-[1rem] font-semibold">
              Emergency Procedures
            </div>
            <div className="text-sm flex gap-3 font-normal text-justify">
              <div>1.</div>
              <div>Patient Emergency Response</div>
            </div>
            {[
              "Know location of emergency equipment and communication systems",
              "Understand protocols for patient medical emergencies during scanning",
              "Maintain current CPR and basic life support certification",
            ].map((data) => (
              <>
                <div className="ml-3 flex items-center gap-2 mt-[0.4rem] text-sm font-normal text-justify">
                  <div className="text-xs">
                    <CircleSmall />
                  </div>
                  <div>{data}</div>
                </div>
              </>
            ))}
            <div className="">
              <div className="text-sm flex mb-3 gap-3 mt-4 font-normal text-justify">
                <div>2.</div>
                <div>Equipment Emergency Protocols</div>
              </div>
              {[
                "Know immediate shutdown procedures for equipment malfunction",
                "Understand protocols for water system emergencies or leaks",
                "Maintain contact information for technical support and service",
              ].map((data) => (
                <>
                  <div className="ml-3 flex flex-col text-sm font-normal text-start">
                    <div className="flex flex-row items-center gap-2">
                      <div className="text-xs">
                        <CircleSmall />
                      </div>
                      <div>{data}</div>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>

          <div className="bg-[#e9e7e3] shadow-sm mx-3 lg:mx-10 mt-5 rounded-md p-6">
            <div className="text-lg mb-[1rem] font-semibold">
              Quality Improvement
            </div>
            <div className="text-sm flex gap-3 font-normal text-justify">
              <div>1.</div>
              <div>Documentation Requirements</div>
            </div>
            {[
              "Maintain accurate logs of all scans performed",
              "Document patient selection criteria verification",
              "Record any deviations from standard protocols",
            ].map((data) => (
              <>
                <div className="ml-3 flex items-center gap-2 mt-[0.4rem] text-sm font-normal text-justify">
                  <div className="text-xs">
                    <CircleSmall />
                  </div>
                  <div>{data}</div>
                </div>
              </>
            ))}
            <div className="">
              <div className="text-sm flex mb-3 gap-3 mt-4 font-normal text-justify">
                <div>2.</div>
                <div>Performance Monitoring</div>
              </div>
              {[
                "Participate in departmental quality assurance programs",
                "Report recurring technical issues or patient concerns",
                "Contribute to ongoing protocol refinement and improvement initiatives",
              ].map((data) => (
                <>
                  <div className="ml-3 flex flex-col text-sm font-normal text-start">
                    <div className="flex flex-row items-center gap-2">
                      <div className="text-xs">
                        <CircleSmall />
                      </div>
                      <div>{data}</div>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>

          <div className="bg-[#e9e7e3] shadow-sm mx-3 lg:mx-10 mt-5 mb-5 rounded-md p-6">
            <div className="text-sm flex gap-3 font-normal text-justify">
              <div>
                <b>Remember:</b> QT imaging is a supplementary tool designed to
                assist healthcare providers in breast imaging assessment. Always
                operate within FDA-approved indications and maintain the highest
                standards of patient care and safety
              </div>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};

export default TechGuidelines;
