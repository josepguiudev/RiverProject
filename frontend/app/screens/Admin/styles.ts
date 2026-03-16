import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    cajaPrincipal:{
        width: "80%",
        height: "80%"
    },
    contenedorFila:{
        width: "33%",
        height: "100%",
        borderRadius: 20
    },
    contenedorFila2:{
        width: "22%",
        height: "100%",
        borderRadius: 20
    },
    contenedorVertical:{
        display: "flex",                // En Web es necesario, en Native es por defecto
        flexDirection: "column",
        //justifyContent: "center",     // Opcional: centra verticalmente
        alignItems: "center",           // Opcional: centra horizontalmente
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#E5E5E5', // text-neutral-200
        marginBottom: 8,
    },
    contenedorUserTittleButton:{
        width: "80%",
        height: "8%",
        display: "flex",       
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center", 
        borderWidth: 1,         
        borderColor: 'yellow',     
        borderStyle: 'solid',
    }
})