import fs from 'fs/promises';
import path from 'path';

export async function updateSchemaMiddleware(req, res) {
  try {
    const schemaPath = path.resolve('./src/sdui-schema.json');
    const existingData = await fs.readFile(schemaPath, 'utf-8');
    const existingJson = JSON.parse(existingData);
    
    // Preserve tokens if they're not in the new data
    const newData = {
      ...req.body,
      data: {
        ...req.body.data,
        tokens: req.body.data.tokens || existingJson.data.tokens
      }
    };
    
    const tempPath = schemaPath + '.temp';
    await fs.writeFile(tempPath, JSON.stringify(newData, null, 2), 'utf-8');
    
    const tempContent = await fs.readFile(tempPath, 'utf-8');
    JSON.parse(tempContent); // Validate JSON
    
    await fs.rename(tempPath, schemaPath);
    
    return { success: true };
  } catch (error) {
    console.error('Error updating schema:', error);
    throw error;
  }
} 