import { useQuery } from "@tanstack/react-query";
import { HomeTemplate, useEmpresaStore } from "../index";

export function Home() {
  const { ContarusuariosXempresa, dataempresa } = useEmpresaStore();

  const { data, isLoading } = useQuery({
    queryKey: ["contar usuarios por empresa", { idempresa: dataempresa?.id }],
    queryFn: () => ContarusuariosXempresa({ id_empresa: dataempresa?.id }),
    enabled: !!dataempresa.id,
  });
  return (
      <HomeTemplate />
  );
}


