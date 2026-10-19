export const transformStatementForAPI = (statement, additionalFields) => {
  if (!statement || !additionalFields || !Array.isArray(additionalFields)) {
    return statement;
  }

  let transformed = statement;

  additionalFields.forEach((fieldName) => {
    // 1. Escape special characters in field name to safely use in Regex
    const escapedName = fieldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // 2. Create regex to find exactly {{Field Name}}
    const regex = new RegExp(`{{${escapedName}}}`, 'g');

    // 3. Generate the backend variable format: $ + Label without spaces
    const systemVar = `$${fieldName.replace(/\s+/g, '')}`;

    // 4. Perform the replacement
    transformed = transformed.replace(regex, systemVar);
  });

  return transformed;
};