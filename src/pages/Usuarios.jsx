import { useQuery } from "@tanstack/react-query";
import { UsuariosTemplate, useMarcaStore, useEmpresaStore, SpinnerLoader, useUsuariosStore, BloqueoPagina, } from "../index";

export function Usuarios() {
  const { datapermisos, mostrarModulos, MostrarUsuariosTodos, datausuarios, buscarUsuarios, buscador } = useUsuariosStore();
  const statePermiso = datapermisos.some((objeto)=>objeto.modulos.nombre.includes("Personal"))
  const { dataempresa } = useEmpresaStore();
  const idEmpresa = dataempresa?.id;
  const { isLoading, error } = useQuery({
    queryKey: ["mostrar usuarios", { 
    _id_empresa: dataempresa?.id }], 
    queryFn: () => MostrarUsuariosTodos({
    _id_empresa: dataempresa?.id }),
    enabled: dataempresa?.id != null,
  });

  const { data: buscardata } = useQuery({
    queryKey: [
      "buscar usuarios",
      { _id_empresa: dataempresa.id, buscador: buscador },
    ],
    queryFn: () =>
      buscarUsuarios({ _id_empresa: dataempresa.id, buscador: buscador }),
    enabled: dataempresa.id != null,
  });
  
  const { data:datamodulos } = useQuery({
    queryKey: ["mostrar modulos"],
    queryFn: mostrarModulos,
  });
  if(statePermiso==false){
    return<BloqueoPagina state={statePermiso}/>
  }
  if (isLoading) return <SpinnerLoader />;
  if (error) return <span>Error al cargar usuarios.</span>;

  return <UsuariosTemplate data={datausuarios} />;
}

