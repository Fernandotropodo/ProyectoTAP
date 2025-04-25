import { Routes, Route } from "react-router-dom";
import { ErrorMolecula, Home, Login, Marca, ProtectedRoute, SpinnerLoader, useEmpresaStore, UserAuth, useUsuariosStore, Categorias, Productos, Usuarios, Kardex, Reportes } from "../index";
import { useQuery } from "@tanstack/react-query";
import { Configuracion } from "../index";
import StockActualTodos from "../components/organismos/report/StockActualTodos";
import StockActualPorProducto from "../components/organismos/report/StockActualPorProducto";
import StockBajoMinimo from "../components/organismos/report/StockBajoMinimo";
import KardexEntradaSalida from "../components/organismos/report/KardexEntradaSalida";
import StockInventarioValorado from "../components/organismos/report/StockInventarioValorado";

export function MyRoutes() {
  const { user } = UserAuth();
  const {mostrarUsuarios, idusuario, mostrarpermisos} = useUsuariosStore()
  const {mostrarEmpresa} = useEmpresaStore()
  const {data:datausuarios, isLoading, error} = useQuery({queryKey:["mostrar usuarios"],
  queryFn:mostrarUsuarios,
});
const {data:dataempresa}=useQuery({queryKey:["mostrar empresa"],queryFn:()=>mostrarEmpresa({idusuario:idusuario}),enabled:!!datausuarios})
const {data:datapermisos}=useQuery({queryKey:["mostrar permisos", {id_usuario:idusuario}],queryFn:()=>mostrarpermisos({id_usuario:idusuario}),enabled:!!datausuarios})

if(isLoading){
  return <SpinnerLoader/>
}
if(error){
  return <ErrorMolecula mensaje={error.message}/>
}
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute user={user} redirectTo="/login" />}>

        <Route path="/" element={<Home />} />

        <Route path="/configurar" element={<Configuracion/>}/>

        <Route path="configurar/marca" element={<Marca/>}/>

        <Route path="configurar/categorias" element={<Categorias/>}/>

        <Route path="configurar/productos" element={<Productos/>}/>

        <Route path="configurar/personal" element={<Usuarios/>}/>
         
        <Route path="kardex" element={<Kardex/>}/>
        
        <Route path="reportes" element={<Reportes/>}>
          <Route path="stock-actual-todos" element={<StockActualTodos/>}/>
          <Route path="stock-actual-por-producto" element={<StockActualPorProducto/>}/>
          <Route path="stock-bajo-minimo" element={<StockBajoMinimo/>}/>
          <Route path="kardex-entradas-salidas" element={<KardexEntradaSalida/>}/>
          <Route path="inventario-valorado" element={<StockInventarioValorado/>}/>
        </Route>
      </Route>
    </Routes>
  );
}
