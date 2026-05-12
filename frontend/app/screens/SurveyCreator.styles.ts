export const creatorStyles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        maxWidth: 1200,
        alignSelf: 'center',
        alignItems: 'center', // Centra el contenido
    },
    mainLayout: {
        width: '100%',
        gap: 25,
        justifyContent: 'center', // Centra las dos columnas
    },
    editorColumn: {
        flex: 1.8,
        width: '100%',
        gap: 20,
    },
    sidebarColumn: {
        flex: 1,
        width: '100%',
        minWidth: 300,
    }
});