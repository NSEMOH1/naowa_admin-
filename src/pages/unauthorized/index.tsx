// pages/unauthorized/index.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  const handleLogout = () => {
    navigate("/");
  };

  // const getRoleDisplayName = (role: string) => {
  //     switch (role) {
  //         case UserRole.STAFF:
  //             return 'Staff';
  //         case UserRole.ADMIN:
  //             return 'Admin';

  //         default:
  //             return 'User';
  //     }
  // };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full">
        {/* Error Icon */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 mb-6">
            <svg
              className="h-12 w-12 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <p className="text-3xl font-bold text-gray-900 mb-2">Access Denied</p>

          <p className="text-xl text-gray-600 mb-4">403 - Forbidden</p>
        </div>

        {/* Error Message */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <div className="text-center">
            <p className="text-gray-700 pb-4">
              You don't have permission to access this page or resource.
            </p>

            {user && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-blue-400 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="text-left">
                    {/* <p className="text-sm text-blue-800">
                                            <span className="font-medium">Current Role:</span> {getRoleDisplayName(user.role)}
                                        </p> */}
                    <p className="text-xs text-blue-600 mt-1">
                      Logged in as: {user.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="text-sm text-gray-600 mb-6">
              <p className="pb-2">This could be because:</p>
              <ul className="text-left space-y-1">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Your current role doesn't have access to this feature
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  You need elevated permissions to view this content
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  The page requires admin access
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleGoToDashboard}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go to Dashboard
          </button>

          <button
            onClick={handleGoBack}
            className="w-full mt-2 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Go Back
          </button>

          <div className="text-center pt-2">
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-700 underline transition duration-200"
            >
              Switch Account
            </button>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-2">
            Need access to this feature?
          </p>
          <p className="text-sm text-gray-600">
            Contact your system administrator or
            <a
              href="mailto:support@coop.com"
              className="text-blue-600 hover:text-blue-800 ml-1"
            >
              support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
