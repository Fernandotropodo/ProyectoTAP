import { useQuery } from "@tanstack/react-query";
import { MarcaTemplate, useMarcaStore, useEmpresaStore, SpinnerLoader, useUsuariosStore, BloqueoPagina } from "../index";

export function Marca() {
    const {datapermisos} = useUsuariosStore();
    const statePermiso = datapermisos.some((objeto)=>objeto.modulos.nombre.includes("Marca de productos"))

  const { mostrarMarca, datamarca, buscarMarca, buscador } = useMarcaStore();
  const { dataempresa } = useEmpresaStore();
  const idEmpresa = dataempresa?.id;
  const { isLoading, error } = useQuery({
    queryKey: ["mostrar marca", { id_empresa: idEmpresa }],
    queryFn: () => mostrarMarca({ id_empresa: idEmpresa }),
    enabled: !!idEmpresa,
  });

  const { data: buscardata } = useQuery({
    queryKey: ["buscar marca", { id_empresa: idEmpresa, descripcion: buscador }],
    queryFn: () => buscarMarca({ id_empresa: idEmpresa, descripcion: buscador }),
    enabled: !!idEmpresa,
  });
  if(statePermiso==false){
    return<BloqueoPagina state={statePermiso}/>
  }
  if (isLoading) return <SpinnerLoader />;
  if (error) return <span>Error al cargar marcas.</span>;

  return <MarcaTemplate data={buscardata ?? datamarca} />;
}

