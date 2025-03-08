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
              console.log("Received request to update schema");
              let body = "";
              req.on("data", (chunk) => {
                body += chunk;
              });

              req.on("end", async () => {
                try {
                  // Parse the request body
                  const data = JSON.parse(body);
                  console.log("Parsed request data successfully");
                  
                  const schemaPath = path.resolve("./src/sdui-schema.json");
                  console.log(`Schema path: ${schemaPath}`);
                  
                  // Verify the schema file exists
                  try {
                    await fs.promises.access(schemaPath);
                    console.log("Schema file exists and is accessible");
                  } catch (accessError) {
                    console.error(`Schema file not accessible: ${accessError.message}`);
                    res.statusCode = 500;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({
                      error: "Schema file not accessible",
                      details: accessError.message,
                    }));
                    return;
                  }
                  
                  // Check if this update should avoid triggering a refresh
                  const shouldRefresh = data.shouldRefresh !== false;
                  
                  // Read existing file to preserve tokens before any operations
                  let existingData;
                  let existingJson;
                  
                  try {
                    existingData = await fs.promises.readFile(schemaPath, "utf-8");
                    existingJson = JSON.parse(existingData);
                    console.log("Successfully read existing schema file");
                  } catch (readError) {
                    console.error(`Error reading schema file: ${readError.message}`);
                    res.statusCode = 500;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({
                      error: "Failed to read schema file",
                      details: readError.message,
                    }));
                    return;
                  }
                  
                  // Merge data, preserving tokens
                  const newData = {
                    ...data,
                    data: {
                      ...data.data,
                      tokens: data.data.tokens || existingJson.data.tokens,
                    },
                  };
                  
                  if (!shouldRefresh) {
                    // For updates that shouldn't refresh, write to a temporary file first
                    const tempPath = path.resolve("./src/sdui-schema-temp.json");
                    console.log(`Writing to temp file: ${tempPath}`);
                    
                    try {
                      // Write to temp file
                      await fs.promises.writeFile(
                        tempPath,
                        JSON.stringify(newData, null, 2)
                      );
                      console.log("Successfully wrote to temp file");
                      
                      // After a slight delay, copy the temp file to the actual schema file
                      setTimeout(async () => {
                        try {
                          const tempData = await fs.promises.readFile(tempPath, "utf-8");
                          await fs.promises.writeFile(schemaPath, tempData);
                          console.log("Schema updated without triggering refresh");
                        } catch (err) {
                          console.error(`Error updating schema file: ${err.message}`);
                        }
                      }, 500);
                      
                      res.setHeader("Content-Type", "application/json");
                      res.end(JSON.stringify({ success: true, refreshed: false }));
                    } catch (writeError) {
                      console.error(`Error writing temp file: ${writeError.message}`);
                      res.statusCode = 500;
                      res.setHeader("Content-Type", "application/json");
                      res.end(JSON.stringify({
                        error: "Failed to write temp file",
                        details: writeError.message,
                      }));
                    }
                  } else {
                    // Standard update that allows refresh
                    console.log("Applying direct schema update");
                    
                    try {
                      // Write updated schema
                      await fs.promises.writeFile(
                        schemaPath,
                        JSON.stringify(newData, null, 2)
                      );
                      console.log("Successfully updated schema file");
                      
                      res.setHeader("Content-Type", "application/json");
                      res.end(JSON.stringify({ success: true, refreshed: true }));
                    } catch (writeError) {
                      console.error(`Error writing schema file: ${writeError.message}`);
                      res.statusCode = 500;
                      res.setHeader("Content-Type", "application/json");
                      res.end(JSON.stringify({
                        error: "Failed to write schema file",
                        details: writeError.message,
                      }));
                    }
                  }
                } catch (error) {
                  console.error(`Error handling schema update: ${error.message}`);
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
