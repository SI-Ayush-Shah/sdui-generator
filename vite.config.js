import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory
  const env = loadEnv(mode, process.cwd(), "");

  // Expose both import.meta.env and process.env
  const processEnvValues = {};
  for (const key in env) {
    if (key.startsWith("VITE_")) {
      processEnvValues[`process.env.${key}`] = JSON.stringify(env[key]);
    }
  }

  return {
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
                  
                  // Check if this update should avoid triggering a refresh
                  const shouldRefresh = data.shouldRefresh !== false;
                  
                  if (!shouldRefresh) {
                    // For updates that shouldn't refresh, write to a temporary file instead
                    // This prevents Vite's HMR from detecting the change and refreshing
                    const tempPath = path.resolve("./src/sdui-schema-temp.json");
                    
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
                    
                    // Write to temp file
                    await fs.promises.writeFile(
                      tempPath,
                      JSON.stringify(newData, null, 2)
                    );
                    
                    // After a slight delay, copy the temp file to the actual schema file
                    // This happens after the response is sent, so it won't affect the current request
                    setTimeout(async () => {
                      try {
                        const tempData = await fs.promises.readFile(tempPath, "utf-8");
                        await fs.promises.writeFile(schemaPath, tempData);
                        console.log("Schema updated without triggering refresh");
                      } catch (err) {
                        console.error("Error updating schema file:", err);
                      }
                    }, 500);
                    
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({ success: true, refreshed: false }));
                  } else {
                    // Standard update that allows refresh
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
                    res.end(JSON.stringify({ success: true, refreshed: true }));
                  }
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
    define: {
      ...processEnvValues,
    },
  };
});
