import { X } from "lucide-react";

const colors = {
  lightestBlue: "#e0fbfc",
  lightBlue: "#c2dfe3",
  mediumBlue: "#9db4c0",
  darkBlue: "#5c6b73",
  darkestBlue: "#253237",
};

export default function ProfileModal({
    showProfile,
    setShowProfile,
    patientProfile = null, // Default to null if no profile is provided
}) {
  return (
    <>
      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-lg font-semibold"
                style={{ color: colors.darkestBlue }}
              >
                Profile Information
              </h3>
              <button
                onClick={() => setShowProfile(false)}
                style={{ color: colors.darkBlue }}
              >
                <X size={24} />
              </button>
            </div>
            {patientProfile && (
              <div className="space-y-3">
                <div>
                  <label
                    className="text-sm font-medium"
                    style={{ color: colors.darkBlue }}
                  >
                    Name
                  </label>
                  <p className="text-gray-800">
                    {patientProfile.personalInfo.name}
                  </p>
                </div>
                <div>
                  <label
                    className="text-sm font-medium"
                    style={{ color: colors.darkBlue }}
                  >
                    Email
                  </label>
                  <p className="text-gray-800">
                    {patientProfile.personalInfo.email}
                  </p>
                </div>
                <div>
                  <label
                    className="text-sm font-medium"
                    style={{ color: colors.darkBlue }}
                  >
                    Phone
                  </label>
                  <p className="text-gray-800">
                    {patientProfile.personalInfo.phone}
                  </p>
                </div>
                <div>
                  <label
                    className="text-sm font-medium"
                    style={{ color: colors.darkBlue }}
                  >
                    Date of Birth
                  </label>
                  <p className="text-gray-800">
                    {patientProfile.personalInfo.dateOfBirth}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
