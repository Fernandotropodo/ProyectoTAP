import styled from "styled-components";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import { useQuery } from "@tanstack/react-query";
import {
  useEmpresaStore,
  useProductosStore,
  Buscador,
  ListaGenerica,
} from "../../../index";
import { useState } from "react";

function KardexEntradaSalida() {
  const [stateListaproductos, setstateListaProductos] = useState(false);
  const {
    buscarproductos,
    mostrarproductosQuery,
    buscador,
    setBuscador,
    selectproductos,
    productosItemSelect,
    reportKardexEntradaSalida
  } = useProductosStore();
  const { dataempresa } = useEmpresaStore();

  const { data: dataProductosTodos } = useQuery({
    queryKey: ["productos todos", { id_empresa: dataempresa?.id }],
    queryFn: () => mostrarproductosQuery({ id_empresa: dataempresa?.id }),
    enabled: !!dataempresa,
  });

  const { data: dataproductosbuscador } = useQuery({
    queryKey: ["buscar productos", { _id_empresa: dataempresa?.id, buscador }],
    queryFn: () =>
      buscarproductos({ _id_empresa: dataempresa?.id, buscador }),
    enabled: !!dataempresa && buscador.trim() !== "",
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["reporte kardex entrada salida", { _id_empresa: dataempresa?.id, _id_producto: productosItemSelect?.id }],
    queryFn: () => reportKardexEntradaSalida({ _id_empresa: dataempresa?.id, _id_producto: productosItemSelect?.id }),
    enabled: !!dataempresa && !!productosItemSelect?.id,
  });

  const productosParaMostrar =
    buscador.trim() !== "" && dataproductosbuscador?.length > 0
      ? dataproductosbuscador
      : dataProductosTodos ?? [];

  const styles = StyleSheet.create({
    page: { flexDirection: "row" },
    section: { margin: 10, padding: 10, flexGrow: 1 },
    row: {
      flexDirection: "row",
      borderBottom: 1,
      borderBottomColor: "#121212",
      alignItems: "center",
      height: 24,
      borderLeft: 1,
      borderLeftColor: "#000",
    },
    cell: {
      flex: 1,
      textAlign: "center",
    },
    headerCell: {
      flex: 1,
      backgroundColor: "#dcdcdc",
      fontWeight: "bold",
      textAlign: "center",
    },
  });

  const currentDate = new Date();
  const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;

  const renderTableRow = (rowData, isHeader = false) => (
    <View style={styles.row} key={rowData.id ?? rowData.descripcion}>
      <Text style={[styles.cell, isHeader && styles.headerCell]}>
        {rowData.nombres}
      </Text>
      <Text style={[styles.cell, isHeader && styles.headerCell]}>
        {rowData.descripcion}
      </Text>
      <Text style={[styles.cell, isHeader && styles.headerCell]}>
        {rowData.tipo}
      </Text>
      <Text style={[styles.cell, isHeader && styles.headerCell]}>
        {rowData.cantidad}
      </Text>
      <Text style={[styles.cell, isHeader && styles.headerCell]}>
        {rowData.fecha}
      </Text>
      <Text style={[styles.cell, isHeader && styles.headerCell]}>
        {rowData.stock}
      </Text>
    </View>
  );

  return (
    <Container>
      <Buscador
        setBuscador={setBuscador}
        funcion={() => {
          setBuscador("");
          setstateListaProductos(true);
        }}
      />

      {stateListaproductos && (
        <ListaGenerica
          data={productosParaMostrar}
          funcion={(p) => {
            selectproductos(p);
            setBuscador("");
            setstateListaProductos(false);
          }}
          setState={() => setstateListaProductos(false)}
        />
      )}

      <PDFViewer className="pdfviewer">
        <Document title="Reporte de stock por producto">
          <Page size="A4" orientation="landscape">
            <View style={styles.page}>
              <View style={styles.section}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "ultrabold",
                    marginBottom: 10,
                  }}
                >
                  Kardex - entradas y salidas por producto
                </Text>
                <Text>Fecha y hora del reporte: {formattedDate}</Text>
                <View>
                  {renderTableRow(
                    {
                      nombres: "Usuario",
                      descripcion: "Producto",
                      tipo: "Movimiento",
                      cantidad: "Cantidad",
                      fecha: "Fecha",
                      stock: "Stock",
                    },
                    true
                  )}
                  {data?.map((item) => renderTableRow(item))}
                </View>
              </View>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 80vh;
  display: flex;
  flex-direction: column;
  gap: 15px;

  .pdfviewer {
    width: 100%;
    height: 100%;
  }
`;

export default KardexEntradaSalida;

