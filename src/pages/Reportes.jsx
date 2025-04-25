import { useQuery } from "@tanstack/react-query";
import { MarcaTemplate, useMarcaStore, useEmpresaStore, SpinnerLoader, useUsuariosStore, BloqueoPagina, ReportesTemplate, useKardexStore } from "../index";

export function Reportes() {
  const {datapermisos} = useUsuariosStore();
  const statePermiso = datapermisos.some((objeto)=>objeto.modulos.nombre.includes("Marca de productos"))
  const { mostrarKardex} = useKardexStore();
  const { dataempresa } = useEmpresaStore();
  const idEmpresa = dataempresa?.id;
  const { isLoading, error } = useQuery({
    queryKey: ["mostrar kardex", { _id_empresa: dataempresa?.id }],
    queryFn: () => mostrarKardex({ _id_empresa: dataempresa?.id }),
    enabled: dataempresa?.id !=null,
  });

  if(statePermiso==false){
    return<BloqueoPagina state={statePermiso}/>
  }
  if (isLoading) return <SpinnerLoader />;
  if (error) return <span>Error al cargar marcas.</span>;

  return <ReportesTemplate/>;
}

