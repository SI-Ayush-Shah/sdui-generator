import React from "react";
import { RouterProvider } from "react-router-dom";
import { Provider } from 'react-redux';
import { router } from "./router";
import config from "./sdui-schema.json";
import { generateCssFromJson } from "@sikit/theme";
import { Toaster } from "react-hot-toast";
import { PendingChangesProvider } from "./contexts/PendingChangesContext";
import store from "./store";

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
      console.error("Error generating CSS from tokens:", error);
      return "";
    }
  };
  const cssContent = generateStyles();

  // Create placeholder handlers that will be overridden by the real handlers in JsonBuilder
  const dummyApplyChanges = () => {};
  const dummyDiscardChanges = () => {};

  return (
    <Provider store={store}>
      <PendingChangesProvider
        applyChanges={dummyApplyChanges}
        discardChanges={dummyDiscardChanges}
      >
        <style>{cssContent}</style>
        <RouterProvider router={router} />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--color-background_main_card)",
              color: "var(--color-text_main_high)",
            },
          }}
        />
      </PendingChangesProvider>
    </Provider>
  );
};

export default App;
