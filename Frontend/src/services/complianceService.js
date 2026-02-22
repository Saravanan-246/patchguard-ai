import API from "./api";

export const getCompliance = (systemId) =>
  API.get(`/compliance/${systemId}`);