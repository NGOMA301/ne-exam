// Utility functions for generating random identifiers

export const generateRandomString = (length: number = 6): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const generatePackageNumber = (): string => {
  return `PKG${generateRandomString(6)}`;
};

export const generateRecordNumber = (): string => {
  return `SRV${generateRandomString(6)}`;
};

export const generatePaymentNumber = (): string => {
  return `PAY${generateRandomString(6)}`;
};

export const generatePlateNumber = (): string => {
  // Generate a more realistic plate number format (3 letters + 3 numbers)
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  
  let plate = '';
  // Add 3 random letters
  for (let i = 0; i < 3; i++) {
    plate += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  // Add 3 random numbers
  for (let i = 0; i < 3; i++) {
    plate += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  
  return plate;
};