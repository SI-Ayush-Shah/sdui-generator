import { join } from "path";
import config from "./src/sdui-schema.json";
import {
  generateTailwindConfigFromJson,
  generateCssFromJson,
} from "@sikit/theme";
let tailwindConfig;
try {
  tailwindConfig = generateTailwindConfigFromJson(
    config.data.tokens["40b949f1-5800-4025-8395-ed22bd52ccc6"]
  );
} catch (err) {
  console.log("something went wrong", err);
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      "{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html,js,jsx}"
    ),
    join(__dirname, "node_modules/@sikit/**/*.{ts,tsx,html,js,jsx}"),
  ],
  safelist: [
    {
      pattern: /rounded-tr-radius[^/\s]+$/,
    },

    {
      pattern: /rounded-tl-radius[^/\s]+$/,
    },
    {
      pattern: /rounded-bl-radius[^/\s]+$/,
    },

    {
      pattern: /rounded-br-radius[^/\s]+$/,
    },

    {
      pattern: /p[tlrb]-spacing_\d+(?:_\d+)?(?:\.\d+)?$/,
    },
    {
      pattern: /gap-spacing_\d+(?:_\d+)?(?:\.\d+)?$/,
    },
    {
      pattern: /-m[tb]-\d+(\.\d+)?/,
    },
    {
      pattern: /gap-\d+(\.\d+)?/,
    },
    {
      pattern: /bg-background[^/\s]+$/,
    },
    {
      pattern: /bg-border[^/\s]+$/,
    },
    {
      pattern: /bg-text[^/\s]+$/,
    },
    {
      pattern: /bg-color[^/\s]+$/,
    },
    {
      pattern: /bg-button[^/\s]+$/,
    },
    {
      pattern: /border-background[^/\s]+$/,
    },
    {
      pattern: /border-text[^/\s]+$/,
    },
    {
      pattern: /border-border[^/\s]+$/,
    },
    {
      pattern: /border-color[^/\s]+$/,
    },
    {
      pattern: /border-button[^/\s]+$/,
    },

    {
      pattern: /text-background[^/\s]+$/,
    },
    {
      pattern: /text-text[^/\s]+$/,
    },
    {
      pattern: /text-border[^/\s]+$/,
    },
    {
      pattern: /text-color[^/\s]+$/,
    },
    {
      pattern: /text-button[^/\s]+$/,
    },

    {
      pattern: /rounded-radius[^/\s]+$/,
    },
    {
      pattern: /text-button[^/\s]+$/,
    },
    {
      pattern: /(bg-opacity|w|h)-\d+(\.\d+)?$/,
    },
    {
      pattern: /order-\d+(\.\d+)?/,
    },
    {
      pattern: /rounded-(br|bl|tr|tl)-(\d+(\.\d+)?|\[.*?\])/,
    },
  ],

  ...tailwindConfig,
};
