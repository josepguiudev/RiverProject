import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    // ==================== ESTILOS ORIGINALES (WEB + MÓVIL BASE) ====================
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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: '#e7c921',
        marginBottom: 8,
    },
    contenedorUserTittleButton:{
        width: "100%",
        height: "8%",
        display: "flex",       
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center", 
    },
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        padding: 20,
    },
    scrollView: {
        backgroundColor: '#2a2a2a',
        borderRadius: 15,
        marginVertical: 10,
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
        maxHeight: 150,
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

    // ==================== NUEVOS ESTILOS SOLO PARA ANDROID ====================
    // (No afectan a la web porque solo se usan cuando isWeb === false)
    androidSafeArea: {
        flex: 1,
        backgroundColor: '#0e0d0df1',
    },
    androidContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 20,
    },
    androidMenuButton: {
        backgroundColor: '#1b2838',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginVertical: 12,
        elevation: 2,
    },
    androidMenuText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    androidSection: {
        backgroundColor: '#161a1f',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#2a2e35',
        elevation: 4,
    },
    androidSectionHeader: {
        backgroundColor: '#0f1115',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#2a2e35',
    },
    androidSectionTitle: {
        color: '#3b82f6',
        fontSize: 16,
        fontWeight: 'bold',
    },
    androidCardsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        gap: 12,
    },
    androidCardWrapper: {
        flex: 1,
    },
    androidScrollArea: {
        maxHeight: 260,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    androidButtonArea: {
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#2a2e35',
    },
    androidUserCard: {
        padding: 12,
        backgroundColor: '#1b2838',
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#2a475e',
    },
    androidUserAvatar: {
        width: 64,
        height: 64,
        borderRadius: 10,
        borderWidth: 2,
    },
    androidUserName: {
        color: 'gold',
        fontWeight: 'bold',
        fontSize: 16,
    },
    androidStatusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 5,
    },
    androidStatusText: {
        color: '#ccc',
        fontSize: 11,
    },
    androidUserId: {
        color: '#aaa',
        fontSize: 10,
        marginTop: 4,
    },
    androidUserExtra: {
        marginTop: 10,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#2a475e',
    },
    androidExtraText: {
        color: '#ccc',
        fontSize: 10,
        marginBottom: 2,
    },
    androidGameCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#1b2838',
        borderRadius: 12,
        marginBottom: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#66c0f4',
    },
    androidGameIcon: {
        width: 40,
        height: 40,
        borderRadius: 6,
        backgroundColor: '#171a21',
    },
    androidGameInfo: {
        marginLeft: 12,
        flex: 1,
    },
    androidGameName: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 13,
    },
    androidGameMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    androidGameId: {
        color: '#888',
        fontSize: 9,
    },
    androidGameHours: {
        color: '#66c0f4',
        fontSize: 9,
        fontWeight: '600',
    },
    androidDetailCard: {
        padding: 12,
    },
    androidDetailImage: {
        width: '100%',
        height: 120,
        borderRadius: 12,
        marginBottom: 12,
    },
    androidDetailTitle: {
        color: 'gold',
        fontWeight: 'bold',
        fontSize: 18,
    },
    androidDetailSub: {
        color: '#888',
        fontSize: 11,
        marginBottom: 10,
    },
    androidGenresContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 4,
    },
    androidGenreBadge: {
        backgroundColor: '#2a475e',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginRight: 6,
        marginBottom: 6,
    },
    androidGenreText: {
        color: '#66c0f4',
        fontSize: 11,
        fontWeight: 'bold',
    },
    androidCategoriesText: {
        color: '#5dade2',
        fontSize: 11,
        marginBottom: 10,
    },
    androidDescription: {
        color: '#aaa',
        fontSize: 11,
        fontStyle: 'italic',
        lineHeight: 16,
    },
});