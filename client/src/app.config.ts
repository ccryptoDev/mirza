let baseUrl = "localhost:3000";
const environment = process.env.NODE_ENV;

if (
  environment &&
  environment === "development" &&
  process.env.REACT_APP_BASE_URL
) {
  baseUrl = process.env.REACT_APP_BASE_URL;
}

if (environment && environment !== "development") {
  baseUrl = "localhost:3000";
}

const url = baseUrl;
export default url;
