import { create } from "zustand";
import { ContarUsuariosXempresa, MostrarEmpresa, supabase } from "../index";
export const useEmpresaStore = create((set, get) => ({
  contadorusuarios: 0,
  dataempresa: {},

  mostrarEmpresa: async (p) => {
    const response = await MostrarEmpresa(p);
    set({ dataempresa: response.empresa });
    return response.empresa;
  },

  ContarusuariosXempresa: async (p) => {
    const id_empresa_number = Number(p.id_empresa);
    const { data, error } = await supabase.rpc("contar_usuarios_por_empresa", {
      _id_empresa: p.id_empresa,
    });

    if (error) {
      console.error("Error al contar usuarios:", error);
      return 0;
    }

    const cantidad = data ?? 0;
    set({ contadorusuarios: cantidad });
    return cantidad;
  }
}));






