import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "configure-server",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url === "/api/update-schema" && req.method === "POST") {
            let body = "";
            req.on("data", (chunk) => {
              body += chunk;
            });

            req.on("end", async () => {
              try {
                const data = JSON.parse(body);
                const schemaPath = path.resolve("./src/sdui-schema.json");

                // Read existing file to preserve tokens
                const existingData = await fs.promises.readFile(
                  schemaPath,
                  "utf-8"
                );
                const existingJson = JSON.parse(existingData);

                // Merge data, preserving tokens
                const newData = {
                  ...data,
                  data: {
                    ...data.data,
                    tokens: data.data.tokens || existingJson.data.tokens,
                  },
                };

                await fs.promises.writeFile(
                  schemaPath,
                  JSON.stringify(newData, null, 2)
                );

                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ success: true }));
              } catch (error) {
                console.error("Error handling request:", error);
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(
                  JSON.stringify({
                    error: "Failed to update schema",
                    details: error.message,
                  })
                );
              }
            });
          } else {
            next();
          }
        });
      },
    },
  ],
});
