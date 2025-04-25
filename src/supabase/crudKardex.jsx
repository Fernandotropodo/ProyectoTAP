import { supabase } from "../index";
import Swal from "sweetalert2";
export async function InsertarKardex(p) {
  const { error } = await supabase.from("kardex").insert(p);
  if (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.message,
      footer: '<a href="">...</a>',
    });
  }
}

export async function MostrarKardex(p) {
  const id_empresa = p.id_empresa ?? p._id_empresa;

  if (!id_empresa) {
    console.error("❌ ID de empresa no definido en MostrarKardex:", p);
    return null;
  }

  const { data, error } = await supabase.rpc("mostrarkardexempresa", {
    _id_empresa: id_empresa,
  });

  if (error) {
    console.error("Error al mostrar kardex:", error.message);
  }

  return data;
}



export async function BuscarKardex(p) {
  const { data } = await supabase.rpc("buscarkardexempresa", p)
  return data;

}

export async function Eliminarkardex(p) {
  const {error} = await supabase.from("kardex").delete().eq("id", p.id);
  if (error) {
    alert("Error al editar el Kardex", error.message)
  }
}



