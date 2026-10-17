/** True when no VITE_APPLICATION_ENDPOINT is configured: submissions stay in the browser. */
export const isDemoSubmission = !import.meta.env.VITE_APPLICATION_ENDPOINT;
