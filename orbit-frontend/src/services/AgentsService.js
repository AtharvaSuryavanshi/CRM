import api from "./api";

const getAllAgents = async () => {
  const res = await api.get("/agents");
  return res.data;
};

const createAgent = async (data) => {
  const res = await api.post("/agents", data);
  return res.data;
};

const deleteAgent = async (id) => {
  const res = await api.delete(`/agents/${id}`);
  return res.data;
};

const agentsService = {
  getAllAgents,
  createAgent,
  deleteAgent,
};

export default agentsService;