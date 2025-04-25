import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { v } from "../../../styles/variables";
import {
  InputText,
  Btnsave,
  ConvertirCapitalize,
  useCategoriasStore,
  useUsuariosStore,
} from "../../../index";
import { useForm } from "react-hook-form";
import { useEmpresaStore } from "../../../store/EmpresaStore";
import { CirclePicker } from "react-color";
import { useQueryClient } from "@tanstack/react-query";


export function RegistrarCategorias({ onClose, dataSelect, accion }) {
  const { datapermisos } = useUsuariosStore();

  const formRef = useRef();
  const [currentColor, setColor] = useState("#F44336");
  const { insertarcategorias, editarcategorias } = useCategoriasStore();
  const { dataempresa } = useEmpresaStore();
  const queryClient = useQueryClient();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const elegirColor = (color) => setColor(color.hex);

  async function insertar(data) {
    if (accion === "Editar") {
      await editarcategorias({
        id: dataSelect.id,
        descripcion: ConvertirCapitalize(data.nombre),
        color: currentColor,
      });
    } else {
      await insertarcategorias({
        _descripcion: ConvertirCapitalize(data.nombre),
        _idempresa: dataempresa.id,
        _color: currentColor,
      });
    }

    queryClient.invalidateQueries(["mostrar categorias"]);
    queryClient.invalidateQueries(["buscar categorias"]);
    onClose(); // cerrar modal
  }

  useEffect(() => {
    if (accion === "Editar" && dataSelect?.color) {
      setColor(dataSelect.color);
    }
  }, [accion, dataSelect]);
 
  return (
    <Container>
      <div className="sub-contenedor">
        <div className="headers">
          <section>
            <h1>{accion === "Editar" ? "Editar categorías" : "Registrar nueva categoría"}</h1>
          </section>
          <section>
            <span onClick={onClose}>x</span>
          </section>
        </div>

        <form ref={formRef} className="formulario" onSubmit={handleSubmit(insertar)}>
          <section>
            <article>
              <InputText icono={<v.iconomarca />}>
                <input
                  className="form__field"
                  defaultValue={dataSelect.descripcion}
                  type="text"
                  placeholder=""
                  {...register("nombre", { required: true })}
                />
                <label className="form__label">Categoría</label>
                {errors.nombre?.type === "required" && <p>Campo requerido</p>}
              </InputText>
            </article>

            <article className="colorContainer">
              <CirclePicker onChange={elegirColor} color={currentColor} />
            </article>

            <div className="btnguardarContent">
              <Btnsave
                icono={<v.iconoguardar />}
                titulo="Guardar"
                bgcolor="#ef552b"
                funcion={() => formRef.current.requestSubmit()}
              />
            </div>
          </section>
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
    width: 500px;
    max-width: 85%;
    border-radius: 20px;
    background: ${({ theme }) => theme.bgtotal};
    box-shadow: -10px 15px 30px rgba(10, 9, 9, 0.4);
    padding: 13px 36px 20px 36px;
    z-index: 100;

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
      section {
        gap: 20px;
        display: flex;
        flex-direction: column;
        .colorContainer {
          .colorPickerContent {
            padding-top: 15px;
            min-height: 50px;
          }
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
