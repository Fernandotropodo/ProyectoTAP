import styled from "styled-components";
import {
 Document,
 Page,
 Text,
 View,
 StyleSheet,
 Font,
 PDFViewer,
} from "@react-pdf/renderer";
import { useEmpresaStore, useProductosStore } from "../../../index";
import { useQuery } from "@tanstack/react-query";

  

function StockInventarioValorado() {
    const {reportInventarioValorado} = useProductosStore()
    const {dataempresa} = useEmpresaStore()
    const {data, isLoading, error} = useQuery({
        queryKey:["reporte stock todos", {_id_empresa:dataempresa?.id}],
        queryFn:()=>reportInventarioValorado({_id_empresa:dataempresa?.id}),enabled:!!dataempresa
    })
    if (isLoading) {
        return <span>cargando</span>;
    }
    if(error) {
        return <span>Error {error.message}</span>
    }
    // Calcular el total general
    const totalGeneral = data?.reduce((acc, item) => acc + item.total, 0) || 0;


    const styles = StyleSheet.create({
        page: {flexDirection:"row",
               position:"relative"},
               section: {margin:10, padding:10, flexGrow:1},
               table: {width: "100%", margin: "auto", marginTop: 10},
               row: {
                flexDirection: "row", borderBottom: "1",
                borderBottomColor: "#121212", alignItems: "stretch",
                height: "24", borderLeftColor: "#000",
                borderLeft: 1, textAlign: "left",
                justifyContent: "flex-start", alignItems: "center",
               },
               cell: {
                flex: 1, textAlign:"center",
                borderLeftColor: "#000", justifyContent: "flex-start", alignItems: "center",
               },
               headerCell: {
                flex: 1, backgroundColor: "#dcdcdc", fontWeight: "bold",
                textAlign: "left", justifyContent: "flex-start", alignItems: "center", textAlign: "center"
               },
    });
    const currentDate = new Date();
    const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`
    const renderTableRow = (rowData, isHeader=false) => (
        <View style={styles.row} key={rowData.id}>

            <Text style={[styles.cell, isHeader && styles.headerCell]}>
                {
                    rowData.descripcion
                }
            </Text>

            <Text style={[styles.cell, isHeader && styles.headerCell]}>
                {rowData.stock}
            </Text>
            
            <Text style={[styles.cell, isHeader && styles.headerCell]}>
                {rowData.preciocompra}
            </Text>

            <Text style={[styles.cell, isHeader && styles.headerCell]}>
                {rowData.total}
            </Text>

        </View>
    )
    return (
    <Container>
        <PDFViewer className="pdfviewer">
            <Document title="Inventario Valorado">
                <Page size="A4"
                orientation="portrait">
                    <View style={styles.page}>
                        <View style={styles.section}>
                            <Text style={{fontSize:18, fontWeight:"ultrabold", marginBottom:10}}>
                                Inventario Valorado
                            </Text>

                            <Text style={{fontSize:18, fontWeight:"ultrabold", marginBottom:10}}>
                                Total: {totalGeneral}
                            </Text>

                            <Text>
                                Fecha y hora del reporte: {formattedDate}
                            </Text>
                            <View>
                                    {
                                    renderTableRow(
                                        {
                                            descripcion: "Producto",
                                            stock: "Stock",
                                            preciocompra: "Precio",
                                            total: "Total"

                                        },
                                        true
                                    )}
                                    {
                                     data?.map((item)=>renderTableRow(item))
                                    }
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
.pdfviewer {
    width: 100%;
    height: 100%;
}
`

export default StockInventarioValorado;