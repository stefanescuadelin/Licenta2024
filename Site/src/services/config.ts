export const endpointURL = process.env.REACT_APP_SERVER_URL || "http://localhost:3000";
export const raspberryUrl = `http://${window.location.hostname}:8000`; // django server
export const headers: {
    Authorization?: string
} = {};
