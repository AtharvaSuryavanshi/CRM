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

const updateAgent = async (id, data) => {
  const res = await api.put(`/agents/${id}`, data);
  return res.data;
};

const getAgentByEmail = async (email) => {
  const res = await api.get(`/agents/email/${email}`);
  return res.data;
};

const agentsService = {
  getAllAgents,
  createAgent,
  deleteAgent,
  updateAgent,
  getAgentByEmail,
};

export default agentsService;