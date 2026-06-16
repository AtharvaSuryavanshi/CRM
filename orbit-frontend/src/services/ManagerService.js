import api from "./api";

const getAllManagers = async () => {
  const res = await api.get("/managers");
  return res.data;
};

const createManager = async (data) => {
  const res = await api.post("/managers", data);
  return res.data;
};

const deleteManager = async (id) => {
  const res = await api.delete(`/managers/${id}`);
  return res.data;
};

const managerService = {
  getAllManagers,
  createManager,
  deleteManager,
};

export default managerService;