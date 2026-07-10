import api from "./index";

export const getMails = (params) =>
  api.get("/dashboard/mails", { params });

export const getMailById = (id) =>
  api.get(`/dashboard/mails/${id}`);

export const deleteMail = (id) =>
  api.delete(`/dashboard/mails/${id}`);
