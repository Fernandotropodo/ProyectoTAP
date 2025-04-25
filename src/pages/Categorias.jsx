import { useQuery } from "@tanstack/react-query";
import {
  BloqueoPagina,
  CategoriasTemplate,
  SpinnerLoader,
  useCategoriasStore,
  useEmpresaStore,
  useUsuariosStore,
} from "../index";

export function Categorias() {
  const {datapermisos} = useUsuariosStore();
  const statePermiso = datapermisos.some((objeto)=>objeto.modulos.nombre.includes("Categoria de productos"))

  const { mostrarcategorias, buscarcategorias, buscador } = useCategoriasStore();
  const { dataempresa } = useEmpresaStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ["mostrar categorias", { id_empresa: dataempresa?.id }],
    queryFn: () => mostrarcategorias({ id_empresa: dataempresa?.id }),
    enabled: !!dataempresa?.id,
  });

  const { data: buscardata } = useQuery({
    queryKey: [
      "buscar categorias",
      { id_empresa: dataempresa?.id, descripcion: buscador },
    ],
    queryFn: () =>
      buscarcategorias({
        id_empresa: dataempresa?.id,
        descripcion: buscador,
      }),
    enabled: !!dataempresa?.id && buscador !== "",
  });


  if (isLoading) {
    return <SpinnerLoader />;
  }
  if (error) {
    return <span>Error...</span>;
  }
  if(statePermiso==false){
    return<BloqueoPagina state={statePermiso}/>
  }
  return (
    <CategoriasTemplate data={buscador !== "" ? buscardata : data} />
  );
}




