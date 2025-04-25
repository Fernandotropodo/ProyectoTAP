import {create} from "zustand"
import { BuscarMarca, EliminarMarca, InsertarMarca, MostrarMarca, EditarMarca } from "../supabase/crudMarca"


export const useMarcaStore = create((set, get)=>({
    buscador: "",
    setBuscador:(p)=>{
        set({buscador:p})
    },
    datamarca: [],
    marcaItemSelect: [],
    parametros: {},
    mostrarMarca: async (p) => {
        const response = await MostrarMarca(p);
        set({parametros:p})
        set({datamarca:response})
        set({marcaItemSelect:response[0]})
        return response;
    },
    selectMarca: (p) => {
        set({marcaItemSelect:p})
    },
    insertarMarca: async (p) => {
        await InsertarMarca(p)
        const {mostrarMarca} = get();
        const {parametros} = get();
        set(mostrarMarca(parametros));
    },
    eliminarMarca: async (p) => {
        await EliminarMarca(p);
        const {mostrarMarca} = get();
        const {parametros} = get();
        set(mostrarMarca(parametros));
    },
    editarMarca: async (p) => {
        await EditarMarca(p);
        const {mostrarMarca} = get();
        const {parametros} = get();
        set(mostrarMarca(parametros));
    },
    mostrarproductos: async (p) => {
        const { data, error } = await supabase
          .from("productos")
          .select("*")
          .eq("id_empresa", p.id_empresa);
    
        if (error) {
          console.error("Error al mostrar productos:", error.message);
          return [];
        }
    
        return data ?? [];
      }

      
}))