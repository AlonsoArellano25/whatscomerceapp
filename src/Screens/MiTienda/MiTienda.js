import React, { useState, useEffect, useCallback } from 'react'
import { StyleSheet, Text, View, FlatList, Image, Alert } from 'react-native'
import { Icon } from 'react-native-elements'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { actualizarRegistro, ListarMisProductos, eliminarProducto } from '../../Utils/Acciones'

export default function MiTienda() {
    const navigation = useNavigation()
    const [productos, setProductos] = useState({})


    useFocusEffect(
        useCallback(() => {
            (
                async () => {
                    setProductos(await ListarMisProductos())
                }
            )()
        }, [])
    )

    return (
        <View style={{ flex: 1, justifyContent: "center" }}>
            {
                productos.length > 0 ? (
                    <FlatList
                        data={productos}
                        renderItem={(item) => (
                            <Producto
                                producto={item}
                                setProductos={setProductos}
                                navigation={navigation}
                            />
                        )}
                    />
                ) :
                    (
                        <View style={{ alignSelf: "center" }}>
                            <View style={{ width: 120, height: 120, borderColor: "#25d366", borderWidth: 1, borderRadius: 60, alignSelf: "center" }}>
                                <Icon
                                    type="material-community"
                                    name="cart-plus"
                                    size={100}
                                    color="#25d366"
                                    style={{ margin: 10 }}
                                />
                            </View>
                        </View>
                    )
            }
            <Icon
                name="plus"
                type="material-community"
                color="#128c7e"
                containerStyle={styles.btnContainer}
                onPress={() => { navigation.navigate("add-product") }}
                reverse
            />
        </View>
    )
}

function Producto({ producto, setProductos, navigation }) {
    const { descripcion, precio, id, imagenes, titulo } = producto.item
    return (
        <View style={styles.container}>
            <Image
                source={{ uri: imagenes[0] }}
                style={{ width: 150, height: 150, borderRadius: 10, marginLeft: 10 }}
                resizeMethod="resize"
            />
            <View style={styles.viewMedio}>
                <Text style={styles.titulo}>{titulo}</Text>
                <Text style={styles.descripcion}>{descripcion.length > 20 ? descripcion.substing(0, 20) : descripcion}...</Text>
                <Text style={styles.precio}>S/.{parseFloat(precio).toFixed(2)}</Text>
                <View style={styles.iconbar}>
                    <View style={styles.icon}>
                        <Icon
                            type="material-community"
                            name="check-outline"
                            color="#25d366"
                            style={styles.icon}
                            onPress={() => {
                                Alert.alert(
                                    "Dar de alta al producto",
                                    "¿Estas seguro de que deseas dar de alta el producto",
                                    [{
                                        style: "default",
                                        text: "Confirmar",
                                        onPress: async () => {
                                            await actualizarRegistro("Productos", id, { status: 0 })
                                            setProductos(await ListarMisProductos())
                                        }
                                    }, {
                                        style: "default",
                                        text: "Salir"
                                    }]
                                )
                            }}
                        />
                    </View>
                    <View style={styles.iconedit}>
                        <Icon
                            type="material-community"
                            name="pencil-outline"
                            color="#ffa000"
                            style={styles.iconedit}
                            onPress={() => navigation.navigate("edit-product", { id })}
                        />
                    </View>
                    <View style={styles.icondelete}>
                        <Icon
                            type="material-community"
                            name="trash-can-outline"
                            color="#d32f2f"
                            style={styles.iconedit}
                            onPress={async () => {
                                Alert.alert(
                                    "Eliminar producto",
                                    "¿Estas seguro que deseas eliminar el producto?",
                                    [
                                        {
                                            style: "default",
                                            text: "Confirmar",
                                            onPress: async () => {
                                                await eliminarProducto("Productos", id)
                                                setProductos(await ListarMisProductos())
                                            }
                                        },
                                        {
                                            style: "default",
                                            text: "Salir"
                                        }
                                    ]
                                )

                            }}
                        />
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    btnContainer: {
        position: "absolute",
        bottom: 10,
        right: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.2,
    },
    container: {
        flexDirection: 'row',
        flex: 1,
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: "#128c7e",
        shadowColor: "#127c7e",
        shadowOffset: { height: 10 },
        shadowOpacity: 0.9
    },
    viewMedio: {
        flex: 1,
        marginRight: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    titulo: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: "700",
        textAlign: "center",
        color: "#075e54"
    },
    descripcion: {
        fontSize: 16,
        color: "#757575"
    },
    precio: {
        fontSize: 16,
        color: "#128c7e",
    },
    iconbar: {
        marginTop: 20,
        flexDirection: "row"
    },
    icon: {
        borderWidth: 1,
        borderColor: "#25d366",
        padding: 5,
        borderRadius: 60,
        marginLeft: 20
    },
    iconedit: {
        borderWidth: 1,
        borderColor: "#ffa000",
        padding: 5,
        borderRadius: 50,
        marginLeft: 20
    },
    icondelete: {
        borderWidth: 1,
        borderColor: "#d32f2f",
        padding: 5,
        borderRadius: 50,
        marginLeft: 20
    },
})