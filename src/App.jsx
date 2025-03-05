import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import config from "./sdui-schema.json";
import { generateCssFromJson } from "@sikit/theme";
import { Toaster } from "react-hot-toast";

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

  return (
    <>
      <style>{generateStyles()}</style>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </>
  );
};

export default App;
