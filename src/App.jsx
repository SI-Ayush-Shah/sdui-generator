import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import json from "./sdui-schema.json";
import { generateCssFromJson } from "@sikit/theme";
const App = () => {
  return (
    <>
      <style>
        {generateCssFromJson(
          json.data.tokens["40b949f1-5800-4025-8395-ed22bd52ccc6"]
        )}
      </style>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
