import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    cajaPrincipal: {
        width: '80%',
        height: '80%',
        flexDirection: 'row',
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
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },

    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },

    personaName: {
        fontSize: 16,
        fontWeight: 'bold',
    },

    steamId: {
        fontSize: 12,
        color: '#666',
    },

    threeDots: {
        fontSize: 20,
        paddingHorizontal: 10,
    },

    showGames: {
        marginTop: 10,
        color: '#007bff',
        fontWeight: 'bold',
    },

    gamesScroll: {
        maxHeight: 150, // 🔥 IMPORTANTE → scroll interno
        marginTop: 10,
    },

    gameItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 0.5,
        borderColor: '#ccc',
    },

    gameIcon: {
        width: 30,
        height: 30,
        marginRight: 10,
    },

    gameTitle: {
        fontSize: 14,
        flexShrink: 1,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
    },

    pageButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 8,
        marginHorizontal: 10,
    },

    disabled: {
        backgroundColor: '#ccc',
    },

    pageText: {
        color: '#fff',
        fontWeight: 'bold',
    },

    pageIndicator: {
        fontSize: 16,
        fontWeight: 'bold',
    },

    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
        padding: 8,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    saveButton: {
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 5,
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        padding: 10,
        borderRadius: 5,
    },
    cancelButton: {
        backgroundColor: '#6c757d',
        padding: 10,
        borderRadius: 5,
    },
})