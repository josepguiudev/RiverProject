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
    contenedorAdminUsers:{
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
        fontSize: 16,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: '#e7c921', // text-neutral-200
        marginBottom: 8,
    },
    contenedorUserTittleButton:{
        width: "100%",
        height: "8%",
        display: "flex",       
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center", 
        //borderWidth: 1,         
        //borderColor: 'yellow',     
        //borderStyle: 'solid',
    },

    container: {
        flex: 1,
        backgroundColor: '#1a1a1a', // Fondo oscuro tipo Steam
        padding: 20,
    },
    scrollView: {
        backgroundColor: '#2a2a2a',
        borderRadius: 15, // Bordes muy redondeados
        marginVertical: 10,
        // Sombra para profundidad (Moderno)
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    contentContainer: {
        padding: 20,
    },
    card: {
        backgroundColor: '#222',
        margin: 8,
        borderRadius: 8,
        padding: 10
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
    personaName: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    threeDots: { color: 'white', fontSize: 20 },
    gamesContainer: { marginTop: 10 },
    gameItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
    gameIcon: { width: 30, height: 30, marginRight: 10 },
    gameTitle: { color: 'white', fontSize: 14 },
    showGames: { color: '#00f', marginTop: 5 }
})