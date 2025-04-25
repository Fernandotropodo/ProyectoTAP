import styled from "styled-components";

export function AccionTabla({funcion, icono, color, fontsize}) {
    return (<Container onClick={funcion} $color={color} $fontSize={fontsize}>
{icono}
    </Container>)
}
const Container = styled.span`
color:${(props)=>props.$color};
font-size:${(props)=>props.$fontsize};
cursor: pointer;

`;