import { Api } from "../api";

export const AlunosService = {
  getData: async () => {
    const { data } = await Api.get("/aluno");

    return data;
  },

  getById: async ({ id }) => {
    const { data } = await Api.get(`/aluno/${id}`);

    return data;
  },

  removeById: async ({ id }) => {
    const { status } = await Api.delete(`/aluno/${id}`);

    return status;
  },
};
