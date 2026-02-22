import API from "./api";

export const createSystem = (data) =>
  API.post("/systems", data);

export const getSystems = () =>
  API.get("/systems");

export const getSystemById = (id) =>
  API.get(`/systems/${id}`);

export const updateSystem = (id, data) =>
  API.put(`/systems/${id}`, data);

export const deleteSystem = (id) =>
  API.delete(`/systems/${id}`);