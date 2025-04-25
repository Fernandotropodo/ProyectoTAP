import { create } from "zustand";
import {
  BuscarCategorias,
  EliminarCategorias,
  InsertarCategorias,
  MostrarCategorias,
  EditarCategorias,
} from "../supabase/crudCategorias";

export const useCategoriasStore = create((set, get) => ({
  datacategorias: [],
  categoriasItemSelect: {},
  buscador: "",
  parametros: {},

  setBuscador: (valor) => set({ buscador: valor }),

  selectcategorias: (item) => set({ categoriasItemSelect: item }),

  mostrarcategorias: async (p) => {
    const data = await MostrarCategorias(p);
    set({ datacategorias: data, parametros: p });
    return data;
  },

  insertarcategorias: async (p) => {
    await InsertarCategorias(p);
    const { mostrarcategorias, parametros } = get();
    const response = await mostrarcategorias(parametros);
    set({ datacategorias: response });
  },
  
  editarcategorias: async (p) => {
    await EditarCategorias(p);
    const { mostrarcategorias, parametros } = get();
    const response = await mostrarcategorias(parametros);
    set({ datacategorias: response });
  },
  
  eliminarcategorias: async (p) => {
    await EliminarCategorias(p);
    const { mostrarcategorias, parametros } = get();
    const response = await mostrarcategorias(parametros);
    set({ datacategorias: response });
  },

  buscarcategorias: async (p) => {
    const data = await BuscarCategorias(p);
    return data;
  },
}));

