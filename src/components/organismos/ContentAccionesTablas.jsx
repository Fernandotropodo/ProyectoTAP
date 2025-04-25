import styled from "styled-components";
import { AccionTabla, v } from "../../index";

export function ContentAccionesTabla({funcionEditar, funcionEliminar}) {

    return (<Container>
        <AccionTabla 
        funcion={funcionEditar}
        fontsize="18px"
        color="#7d7d7d"
        icono={<v.iconeditarTabla/>}
        />
        <AccionTabla 
        funcion={funcionEliminar}
        fontsize="18px"
        color="#f76e8e"
        icono={<v.iconeliminarTabla/>}
        />

    </Container>);
}
const Container = styled.div`
display: flex;
gap: 10px;
justify-content: center;
flex-wrap: wrap;
@media (max-width: 48em) {
    justify-content: end;
}
`;