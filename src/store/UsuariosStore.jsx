import { create } from "zustand";
import {
  BuscarUsuarios,
  EliminarUsuarios, 
  InsertarAsignaciones,
  InsertarPermisos,
  InsertarUsuarios,
  MostrarModulos,
  MostrarPermisos,
  MostrarUsuarios,
  MostrarUsuariosTodos,
  supabase,
  EditarUsuario,
  EliminarPermisos,
  DataModulosConfiguracion,
} from "../index";

export const useUsuariosStore = create((set, get) => ({
  // === Estados ===
  datamodulos:[],
  idusuario: 0,
  buscador: "",
  datausuarios: [],
  usuariosItemSelect: [],
  parametros: {},

  // === Setters ===
  setBuscador: (p) => {
    set({ buscador: p });
  },
  selectUsuarios: (p) => {
    set({ usuariosItemSelect: p });
  },

  // === Mostrar usuarios ===
  mostrarUsuarios: async () => {
    const response = await MostrarUsuarios();
    set({ idusuario: response.id });
    return response;
  },
  MostrarUsuariosTodos: async (p) => {
    const response = await MostrarUsuariosTodos(p);
    set({ parametros: p });
    set({ datausuarios: response });
    set({ usuariosItemSelect: response[0] });
    return response;
  },

  // === Insertar usuario admin ===
  insertarUsuarioAdmin: async (p) => {
    const { data, error } = await supabase.auth.signUp({
      email: p.correo,
      password: p.pass,
    });

    console.log("data del registro del user auth", data);
    if (error) return;

    const datauser = await InsertarUsuarios({
      idauth: data.user.id,
      fecharegistro: new Date(),
      tipouser: "superadmin",
    });

    return datauser;
  },

  // === Insertar usuarios con asignaciones y permisos ===
  insertarUsuarios: async (parametrosAuth, p, datacheckpermisos) => {

    const { data, error } = await supabase.auth.signUp({
      email: parametrosAuth.correo,
      password: parametrosAuth.pass
    });
    if (error) {
      return null;
    }

    const dataUserNew = await InsertarUsuarios({
      nombre: p.nombre,
      nro_doc: p.nro_doc,
      telefono: p.telefono,
      direccion: p.direccion,
      fecharegistro: new Date(),
      estado: "activo",
      idauth: data.user.id,
      tipouser: p.tipouser,
      tipodoc: p.tipodoc,
      correo: p.correo
    });

    await InsertarAsignaciones({
      id_empresa: p.id_empresa,
      id_usuario: dataUserNew.id,
    });

    datacheckpermisos.forEach(async (item) => {
      if (item.check) {
        let parametrospermisos = {
          id_usuario: dataUserNew.id,
          idmodulo: item.id
        };
        await InsertarPermisos(parametrospermisos);
      }
    });
    await supabase.auth.signOut();
  },

  // === Eliminar usuario ===
  eliminarUsuarios: async (p) => {
    await EliminarUsuarios(p);
    const { mostrarUsuarios } = get();
    const { parametros } = get();
    set(mostrarUsuarios(parametros));
  },

  // === Editar usuario ===
  editarUsuarios: async (p, datacheckpermisos, idempresa) => {
    await EditarUsuario(p);
    await EliminarPermisos({id_usuario:p.id})
    datacheckpermisos.forEach(async (item) => {
      if (item.check) {
        let parametrospermisos = {
          id_usuario: p.id,
          idmodulo: item.id
        };
        await InsertarPermisos(parametrospermisos);
      }
    });
    const { MostrarUsuariosTodos } = get();
    set(MostrarUsuariosTodos({_id_empresa:idempresa}));
  },

  // === Buscar usuarios ===
  buscarUsuarios: async (p) => {
    const response = await BuscarUsuarios(p);
    set({datausuarios: response});
    return response;
  },
  mostrarModulos: async () => {
    const response = await MostrarModulos()
    set({datamodulos:response})
    return response;
  },
  datapermisos: [],
  datapermisosEdit: [],
  mostrarpermisos: async (p)=>{
    const response = await MostrarPermisos(p);
    set({datapermisos:response})
    let allDocs = [];
    DataModulosConfiguracion.map((element)=>{
      const statePermiso = response.some((objeto)=>objeto.modulos.nombre.includes(element.title)
    );
    if(statePermiso) {
      allDocs.push({...element,state:true})
    }else {
      allDocs.push({...element,state:false})
    }
    });
    DataModulosConfiguracion.splice(0, DataModulosConfiguracion.length)
    DataModulosConfiguracion.push(...allDocs)
    return response;
  },
  mostrarpermisosEdit: async (p)=>{
    const response = await MostrarPermisos(p);
    set({datapermisosEdit:response})
    return response;
  }
}));
