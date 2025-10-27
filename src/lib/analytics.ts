// Mock analytics module
export const logEvent = (eventName: string, params?: Record<string, any>) => {
  console.log(`[Analytics] Event: ${eventName}`, params || "");
};
