import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import config from "./sdui-schema.json";
import { generateCssFromJson } from "@sikit/theme";
import { Toaster } from "react-hot-toast";
import { PendingChangesProvider } from "./contexts/PendingChangesContext";

const App = () => {
  // Add error handling for token generation
  let json = JSON.parse(JSON.stringify(config));
  const generateStyles = () => {
    try {
      const tokenId = "40b949f1-5800-4025-8395-ed22bd52ccc6";
      const tokens = json.data.tokens[tokenId];
      if (!tokens) {
        console.error("No tokens found for ID:", tokenId);
        return "";
      }
      return generateCssFromJson(tokens);
    } catch (error) {
      console.error("Error generating styles:", error);
      return "";
    }
  };

  // Create placeholder handlers that will be overridden by the real handlers in JsonBuilder
  const dummyApplyChanges = () => {};
  const dummyDiscardChanges = () => {};

  return (
    <>
      <style>{generateStyles()}</style>
      <PendingChangesProvider 
        applyChangesHandler={dummyApplyChanges} 
        discardChangesHandler={dummyDiscardChanges}
      >
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </PendingChangesProvider>
    </>
  );
};

export default App;
