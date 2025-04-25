import { create } from "zustand";
import { BuscarKardex, InsertarKardex, MostrarKardex, Eliminarkardex } from "../index";
export const useKardexStore = create((set, get) => ({
  buscador: "",
  setBuscador: (p) => {
    set({ buscador: p });
  },
  datakardex: [],
  kardexItemSelect: [],
  parametros: {},
  mostrarKardex: async (p) => {
    const response = await MostrarKardex(p);
    set({ parametros: p });
    set({ datakardex: response });
    set({kardexItemSelect: response [0] });
    return response;
  },

  insertarKardex: async (p) => {
    await InsertarKardex(p);
    const { mostrarKardex } = get();
    const { parametros } = get();
    set(mostrarKardex(parametros));
  },

  eliminarKardex: async (p) => {
    await Eliminarkardex(p);
    const { mostrarKardex } = get();
    const { parametros } = get();
    await mostrarKardex(parametros); // 🔁 refresca correctamente
  },
  
  
  buscarKardex: async (p) => {
    const response = await BuscarKardex(p);
    set({ datakardex: response });
    return response;
  },
}));
