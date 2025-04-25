import { create } from "zustand";
import { BuscarProductos, EditarProductos, EliminarProductos, InsertarProductos, MostrarProductos, ReportStockBajoMinimo, ReportStockProductosTodos, ReportStockXProducto, ReportKardexEntradaSalida, ReportInventarioValorado } from "../index";
export const useProductosStore = create((set, get) => ({
  buscador: "",
  setBuscador: (p) => {
    set({ buscador: p });
  },
  dataproductos: [],
  productosItemSelect: [],
  parametros: {},
  mostrarproductos: async (p) => {
    const response = await MostrarProductos(p);
    set({ parametros: p });
    set({ dataproductos: response });
    set({ productosItemSelect: [] });
    return response;
    
  },
  selectproductos: (p) => {
    set({ productosItemSelect: p });
  },
  insertarproductos: async (p) => {
    await InsertarProductos(p);
    const { mostrarproductos } = get();
    const { parametros } = get();
    set(mostrarproductos(parametros));
  },
  eliminarproductos: async (p) => {
    await EliminarProductos(p);
    const { mostrarproductos } = get();
    const { parametros } = get();
    set(mostrarproductos(parametros));
  },
  editarproductos: async (p) => {
    await EditarProductos(p);
    const { mostrarproductos } = get();
    const { parametros } = get();
    set(mostrarproductos(parametros));
  },
  buscarproductos: async (p) => {
    const response = await BuscarProductos(p);
    set({ dataproductos: response });
    return response;
  },
  reportStockProductosTodos: async (p) => {
    const response = await ReportStockProductosTodos(p);
    return response;
  },
  reportStockXproducto: async (p) => {
    const response = await ReportStockXProducto(p);
    return response ?? [];
  },
  reportBajoMinimo: async (p) => {
    const response = await ReportStockBajoMinimo(p);
    return response;
  },
  mostrarproductosQuery: async (p) => {
    const response = await MostrarProductos(p);
    return response ?? [];
  },
  reportKardexEntradaSalida: async (p) => {
    const response = await ReportKardexEntradaSalida(p);
    return response;
  },
  reportInventarioValorado: async (p) => {
    const response = await ReportInventarioValorado(p);
    return response;
  },

  
}));