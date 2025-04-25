import { useEffect, useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  v
} from "../../../styles/variables";
import {

  RegistrarMarca,
  InputText,
  Btnsave,
  ConvertirCapitalize,
  useUsuariosStore,
  ContainerSelector,
  Selector,
  useMarcaStore,
  Btnfiltro,
  useCategoriasStore,
  RegistrarCategorias, 
  TipoDocData, TipouserData,
  ListaModulos,
} from "../../../index";
import { EditarUsuario } from "../../../index";
import { useEmpresaStore } from "../../../store/EmpresaStore";
import { ListaGenerica } from "../ListaGenerica";
import { Device } from "../../../styles/breackpoints";

export function RegistrarUsuarios({ onClose, dataSelect, accion }) {
  const { isLoading } = useQuery({
    queryKey: ["mostrar permisos Edit", { id_usuario: dataSelect?.id }],
    queryFn: () => mostrarpermisosEdit({ id_usuario: dataSelect.id }),
    enabled: accion === "Editar" && !!dataSelect?.id // ✅ se ejecuta solo si hay un ID
  });
  


  const [checkboxs, setCheckboxs] = useState([]);
  const [tipodoc, setTipodoc] = useState({icono: "", descripcion: "otros"});
  const [tipouser, setTipouser] = useState({
    icono: "",
    descripcion: "empleado",
  });
  const { insertarUsuarios, mostrarpermisosEdit, editarUsuarios } = useUsuariosStore();
  const { dataempresa } = useEmpresaStore();
  const queryClient = useQueryClient();

  const { marcaItemSelect, datamarca, selectMarca } = useMarcaStore();
  const { categoriasItemSelect, datacategorias, selectcategorias } = useCategoriasStore();

  const [stateTipodoc, setStateTipodoc] = useState(false);
  const [stateTipouser, setStateTipouser] = useState(false);
  const [openRegistroCategoria, setopenRegistroCategoria] = useState(false);
  const [openRegistroMarca, SetopenRegistroMarca] = useState(false);
  const [subaccion, setAccion] = useState("");

  const nuevoRegistroMarca = () => {
    SetopenRegistroMarca(!openRegistroMarca);
    setAccion("Nuevo");
  };

  const nuevoRegistroCategoria = () => {
    setopenRegistroCategoria(!openRegistroCategoria);
    setAccion("Nuevo");
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  async function insertar(data) {
    if (accion === "Editar") {
      const p = {
        id: dataSelect.id,
        nombre: data.nombre,
        correo: data.correo,
        nro_doc: data.nro_doc,
        telefono: data.telefono,
        direccion: data.direccion,
        tipouser: tipouser.descripcion,
        tipodoc: tipodoc.descripcion,
      };
      await editarUsuarios(p, checkboxs, dataempresa.id);
      onClose();
    } else {
      const p = {
        nombre: data.nombre,
        correo: data.correo,
        nro_doc: data.nro_doc,
        telefono: data.telefono,
        direccion: data.direccion,
        tipouser: tipouser.descripcion,
        tipodoc: tipodoc.descripcion,
        id_empresa: dataempresa.id,
      };
      const parametrosAuth = {
        correo:data.correo,
        pass:data.pass
      }
      await insertarUsuarios(parametrosAuth, p, checkboxs);
      onClose();
    }
  }

  useEffect(() => {
    if (accion === "Editar") {
      setTipodoc({icono:"", descripcion:dataSelect.tipodoc})
      setTipouser({icono:"", descripcion:dataSelect.tipouser})
    }
  }, []);
  if(isLoading)
  {
    return <span>cargando...</span>
  }
  return (
    <Container>
      <div className="sub-contenedor">
        <div className="headers">
          <section>
            <h1>{accion === "Editar" ? "Editar usuarios" : "Registrar nuevo usuario"}</h1>
          </section>
          <section>
            <span onClick={onClose}>x</span>
          </section>
        </div>

        <form className="formulario" onSubmit={handleSubmit(insertar)}>
          <section className="seccion1">
          <article>
  <InputText icono={<v.icononombre />}>
    <input
      readOnly={accion === "Editar"} 
      className={accion === "Editar" ? "form__field disabled" : "form__field"}
      defaultValue={dataSelect.correo}
      type="text"
      placeholder=""
      {...register("correo", { required: true })}
    />
    <label className="form__label">correo</label>
    {errors.correo?.type === "required" && <p>Campo requerido</p>}
  </InputText>
</article>


            {
              accion!="Editar"?(            <article>
                <InputText icono={<v.icononombre />}>
                  <input
                    className="form__field"
                    defaultValue={dataSelect.pass}
                    type="text"
                    placeholder=""
                    {...register("pass", { required: true, minLength:6 })}
                  />
                  <label className="form__label">pass</label>
                  {errors.pass?.type === "required" && <p>Campo requerido</p>}
                  {errors.pass?.type === "minLength" && <p>Debe tener al menos 6 caracteres</p>}
                </InputText>
              </article>):(null)
            }

            <article>
              <InputText icono={<v.icononombre />}>
                <input
                  className="form__field"
                  defaultValue={dataSelect.nombre}
                  type="text"
                  placeholder=""
                  {...register("nombre", { required: true })}
                />
                <label className="form__label">Nombres</label>
                {errors.nombre?.type === "required" && <p>Campo requerido</p>}
              </InputText>
            </article>

            <div style={{ position: "relative" }}>
              <ContainerSelector>
                <label>Tipo doc:</label>
                <Selector
                  color="#fc6027"
                  texto1="👷‍♂️"
                  texto2={tipodoc.descripcion}
                  funcion={() => setStateTipodoc(!stateTipodoc)}
                />
                {stateTipodoc && (
                <ListaGenerica
                  data={TipoDocData}
                  bottom="-200px"
                  scroll="scroll"
                  setState={() => setStateTipodoc(false)}
                  funcion={(p) => setTipodoc(p)}
                />
              )}
              </ContainerSelector>
            </div>

            <article>
  <InputText icono={<v.icononombre />}>
    <input
      className="form__field"
      defaultValue={dataSelect.nro_doc}
      type="number"
      placeholder=""
      {...register("nro_doc", { required: true })}
    />
    <label className="form__label">Nro. doc</label>
    {errors.nro_doc?.type === "required" && <p>Campo requerido</p>}
  </InputText>
</article>



<article>
  <InputText icono={<v.icononombre />}>
    <input
      className="form__field"
      defaultValue={dataSelect.telefono}
      type="text"
      placeholder=""
      {...register("telefono", { required: true })}
    />
    <label className="form__label">Telefono</label>
    {errors.telefono?.type === "required" && <p>Campo requerido</p>}
  </InputText>
</article>


            <article>
              <InputText icono={<v.icononombre />}>
                <input
                  className="form__field"
                  defaultValue={dataSelect.direccion}
                  type="text"
                  placeholder=""
                  {...register("direccion", { required: true })}
                />
                <label className="form__label">Direccion</label>
                {errors.direccion?.type === "required" && <p>Campo requerido</p>}
              </InputText>
            </article>
          </section>

          <section className="seccion2">
            <ContainerSelector>
              <label>Tipo: </label>
              <Selector
              color="#fc6027"
              texto1="👷‍♂️"
              texto2={tipouser.descripcion} funcion={()=>setStateTipouser(!stateTipouser)}
              />
              {
                stateTipouser && (
                  <ListaGenerica data={TipouserData}
                  funcion={(p)=>setTipouser(p)}
                  bottom="-150px"
                  scroll="scroll"
                  setState={()=>setStateTipouser(!stateTipouser)}/>
                )
              }
            </ContainerSelector>
            PERMISOS:🔑
            <ListaModulos accion={accion} checkboxs={checkboxs}
            setCheckboxs={setCheckboxs}/>

          </section>

          <div className="btnguardarContent">
            <Btnsave
              type="submit"
              icono={<v.iconoguardar />}
              titulo="Guardar"
              bgcolor="#ef552b"
            />
          </div>
        </form>
      </div>
    </Container>
  );
}


const Container = styled.div`
  transition: 0.5s;
  top: 0;
  left: 0;
  position: fixed;
  background-color: rgba(10, 9, 9, 0.5);
  display: flex;
  width: 100%;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .sub-contenedor {
    width: 100%;
    max-width: 90%;
    border-radius: 20px;
    background: ${({ theme }) => theme.bgtotal};
    box-shadow: -10px 15px 30px rgba(10, 9, 9, 0.4);
    padding: 13px 36px 20px 36px;
    z-index: 100;
    height: 90vh;
    overflow-y: auto;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 6px;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #484848;
      border-radius: 10px;
    }

    .headers {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h1 {
        font-size: 20px;
        font-weight: 500;
      }
      span {
        font-size: 20px;
        cursor: pointer;
      }
    }
    .formulario {
      display: grid;
      grid-template-columns: 1fr;
      gap: 15px;
      @media ${Device.tablet} {
        grid-template-columns: repeat(2, 1fr);
      }
      section {
        gap: 20px;
        display: flex;
        flex-direction: column;
      }
      .btnguardarContent {
        display: flex;
        justify-content: end;
        grid-column: 1;
        @media ${Device.tablet} {
          grid-column: 2;
        }
      }
    }
  }
`;

const ContentTitle = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 20px;
  svg {
    font-size: 25px;
  }
  input {
    border: none;
    outline: none;
    background: transparent;
    padding: 2px;
    width: 40px;
    font-size: 28px;
  }
`;
const ContainerEmojiPicker = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;