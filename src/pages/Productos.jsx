import { useQuery } from "@tanstack/react-query";
import {useEmpresaStore, SpinnerLoader, ProductosTemplate, useProductosStore, useMarcaStore, useCategoriasStore, useUsuariosStore, BloqueoPagina } from "../index";

export function Productos() {
  const {datapermisos} = useUsuariosStore();
  const statePermiso = datapermisos.some((objeto)=>objeto.modulos.nombre.includes("Productos"))

  const {mostrarMarca} = useMarcaStore();
  const {mostrarcategorias} = useCategoriasStore();
  const { mostrarproductos, dataproductos, buscarproductos, buscador } = useProductosStore();
  const descripcion = buscador ?? "";
  const { dataempresa } = useEmpresaStore();
  const idEmpresa = dataempresa?.id;
  const { isLoading, error } = useQuery({
    queryKey: ["mostrar productos", { _id_empresa: idEmpresa }],
    queryFn: () => mostrarproductos({ _id_empresa: idEmpresa }),
    enabled: !!idEmpresa,
  });

  const { data: buscardata } = useQuery({
    queryKey: [
      "buscar productos",
      { id_empresa: dataempresa.id, descripcion: buscador },
    ],
    queryFn: () =>
      buscarproductos({ _id_empresa: dataempresa.id, buscador: buscador }),
    enabled: dataempresa.id != null,
  });

  const { data:datamarcas } = useQuery({
    queryKey: ["mostrar marca", { id_empresa: dataempresa?.id }],
    queryFn: () => mostrarMarca({ id_empresa: dataempresa?.id }),
    enabled: dataempresa?.id != null,
  });
  const {data:datacategorias} = useQuery({
    queryKey: ["mostrar categorias", { id_empresa: dataempresa?.id }],
    queryFn: () => mostrarcategorias({ id_empresa: dataempresa?.id }),
    enabled: dataempresa?.id != null,
  });
  if(statePermiso==false){
    return<BloqueoPagina state={statePermiso}/>
  }
  if (isLoading) return <SpinnerLoader />;
  if (error) return <span>Error al cargar marcas.</span>;

  return <ProductosTemplate data={buscardata ?? dataproductos} />;
}

