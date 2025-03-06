import React from "react";

const EnvExample = () => {
  // You can now use process.env to access environment variables
  const apiUrl = process.env.VITE_API_URL;
  const appName = process.env.VITE_APP_NAME;
  const debugMode = process.env.VITE_DEBUG_MODE === "true";

  // You can also use Vite's native import.meta.env approach
  const authApiUrl = import.meta.env.VITE_AUTH_API_URL;
  const appVersion = import.meta.env.VITE_APP_VERSION;

  return (
    <div className="p-6 bg-background_main_surface rounded-lg shadow-sm border border-border_main_default">
      <h2 className="text-xl font-medium text-text_main_high mb-4">
        Environment Variables Example
      </h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-md font-medium text-text_main_high">
            Using process.env:
          </h3>
          <ul className="list-disc ml-5 text-text_main_medium">
            <li>API URL: {apiUrl}</li>
            <li>App Name: {appName}</li>
            <li>Debug Mode: {debugMode ? "Enabled" : "Disabled"}</li>
          </ul>
        </div>

        <div>
          <h3 className="text-md font-medium text-text_main_high">
            Using import.meta.env:
          </h3>
          <ul className="list-disc ml-5 text-text_main_medium">
            <li>Auth API URL: {authApiUrl}</li>
            <li>App Version: {appVersion}</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 p-4 bg-background_prim_surface rounded border border-border_prim_default">
        <h3 className="text-md font-medium text-text_main_high mb-2">
          How to use environment variables in your code:
        </h3>
        <pre className="bg-gray-800 p-3 rounded text-gray-100 text-sm overflow-auto">
          {`// Access using process.env
const apiUrl = process.env.VITE_API_URL;

// OR using Vite's native approach
const apiUrl = import.meta.env.VITE_API_URL;`}
        </pre>
      </div>
    </div>
  );
};

export default EnvExample;
