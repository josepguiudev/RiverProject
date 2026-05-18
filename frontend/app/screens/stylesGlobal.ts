import { isWeb } from "./../utils/device";
import { StyleSheet, Platform, Dimensions } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

export const colors = {
	background: "#000000",
	cardBg: "#161616",
	primary: "#5b55c0",
	secondary: "#3b82f6",
	accent: "#64B5F6",
	cta: "#8BC34A",
	textMain: "#F0F2F5",
	white: "#ffffff",
	darkCard: "#161616",
	borderDark: "#1A1A1A",
	surface: "#161616",
	text: "#ffffff",
	textSecondary: "#a0a0a0",
	border: "#2a2a2a",
	blue: "#4a90e2",
	danger: "#ff4d4d",
	dashboardBtn: "#3b82f6",
};

export default StyleSheet.create({
	// ========== CONTENEDORES PRINCIPALES ==========
	alineadoPersonal: {
		flex: 1,
		backgroundColor: colors.background,
		width: "100%",
		...Platform.select({
			web: {
				minHeight: "100vh" as any,
				display: "flex" as any,
				flexDirection: "column" as any,
			},
			default: {
				minHeight: "100%",
			},
		}),
	},
	scrollContainer: {
		flexGrow: 1,
	},
	fullWidthContainer: {
		width: "100%",
		flex: 1,
		alignSelf: "stretch",
	},
	centeredContent: {
		justifyContent: "center",
		alignItems: "center",
	},
    // ========== GRID Y TARJETAS DESKTOP OPTIMIZADAS ==========
    contenedorListado: {
        width: '100%',
        maxWidth: 1400, // Permite que el bloque crezca bastante en pantallas anchas
        alignSelf: 'center',
        marginTop: 20,
    },
    gridEncuestas: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start', // Alinea las tarjetas a la izquierda si hay huecos
        gap: 24, // Espacio generoso entre tarjetas
        width: '100%',
    },
    cajaEncuestas: {
        backgroundColor: '#161616',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(91, 85, 192, 0.2)',
        padding: 24,
        flexDirection: 'column',
        justifyContent: 'space-between',
        ...Platform.select({
            web: {
                // Calcula el espacio para poner 2 o 3 tarjetas por fila bien anchas
                width: 'calc(50% - 12px)' as any, // 2 columnas masivas. Si prefieres 3, usa 'calc(33.33% - 16px)'
                minWidth: 340,
                minHeight: 180, 
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
            },
            default: {
                width: '100%',
                minHeight: 160,
                elevation: 3,
                shadowColor: '#000', 
                shadowOffset: { width: 0, height: 2 }, 
                shadowOpacity: 0.2, 
                shadowRadius: 4
            }
        })
    },
	
	contenedorBotonesTarjeta: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
		marginTop: "auto", // Empuja el bloque de botones hacia abajo de la caja de manera uniforme
		paddingTop: 15,
		alignItems: "center",
		width: "100%",
	},

	caja: {
		backgroundColor: colors.surface,
		borderRadius: 24,
		padding: 24,
		width: "85%",
		maxWidth: 450,
		alignSelf: "center",
		borderWidth: 1,
		borderColor: colors.border,
		...Platform.select({
			ios: {
				shadowColor: "#000",
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.2,
				shadowRadius: 4,
			},
			android: { elevation: 4 },
			web: { marginTop: "5%" },
		}),
	},
	cajaDesktop: {
		width: "100%",
		maxWidth: 500,
		padding: 32,
		alignSelf: "center",
	},

	// ========== CABECERA Y LOGO ==========
	contendorLogoTitulos: {
		alignItems: "center",
		flexDirection: isWeb ? "row" : "column",
		justifyContent: "center",
		height: isWeb ? 120 : "auto",
		padding: 10,
		marginBottom: isWeb ? 0 : 20,
		width: "100%",
	},
	containerFoto: {
		width: 80,
		height: 80,
	},
	logo: {
		width: isWeb ? 100 : 120,
		height: isWeb ? "100%" : 120,
		resizeMode: "contain",
		marginBottom: isWeb ? 0 : 10,
	},
	contenedorWritter: {
		alignItems: "center",
		padding: 20,
		flexDirection: "row",
		justifyContent: "center",
		gap: 10,
	},

	// ========== TEXTOS ==========
	tituloHero: {
		fontSize: isWeb ? 42 : 32,
		fontWeight: "900",
		color: colors.primary,
		letterSpacing: -0.5,
		lineHeight: 42,
		fontFamily: Platform.OS === "ios" ? "System" : "sans-serif-condensed",
	},
	tituloHeroDesktop: {
		fontSize: 100,
		lineHeight: 80,
	},
	destaqueAzul: {
		color: colors.secondary,
	},
	mainText: {
		color: colors.white,
		fontSize: 32,
		fontWeight: "bold",
		textAlign: "center",
		fontFamily: Platform.OS === "ios" ? "System" : "sans-serif-condensed",
	},
	mainTextDesktop: {
		fontSize: 48,
	},
	texto: {
		color: colors.white,
		fontSize: 14,
		marginTop: 5,
	},
	textoChico: {
		color: colors.textSecondary,
		fontSize: 14,
		textAlign: "center",
	},
	blueText: {
		color: colors.primary,
	},
	textWrapper: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "center",
		alignItems: "center",
	},

	// ========== BOTONES ==========
	btnPrimary: {
		backgroundColor: colors.cta,
		width: "100%",
		paddingVertical: 16,
		borderRadius: 15,
		alignItems: "center",
		marginBottom: 12,
	},
	btnPrimaryText: {
		color: "#1D2735",
		fontSize: 16,
		fontWeight: "800",
	},
	btnSecondary: {
		width: "100%",
		paddingVertical: 15,
		borderRadius: 15,
		alignItems: "center",
		borderWidth: 1.5,
		borderColor: colors.textMain,
		backgroundColor: "transparent",
	},
	btnDashboard: {
		backgroundColor: colors.dashboardBtn,
		width: "100%",
		paddingVertical: 16,
		borderRadius: 15,
		alignItems: "center",
		marginTop: 10,
		flexDirection: "row",
		justifyContent: "center",
		...Platform.select({
			web: { cursor: "pointer" },
		}),
	},
	btnDashboardText: {
		color: colors.white,
		fontSize: 16,
		fontWeight: "800",
	},
	botonGrande: {
		backgroundColor: colors.primary,
		paddingVertical: 16,
		paddingHorizontal: 32,
		borderRadius: 14,
		alignItems: "center",
		justifyContent: "center",
		minWidth: 200,
		...Platform.select({
			web: { cursor: "pointer" },
		}),
	},
	textoBotonGrande: {
		color: colors.white,
		fontSize: 16,
		fontWeight: "bold",
	},

	cajaEncuestasCompletada: {
		backgroundColor: "#0a0a0a",
		borderColor: "rgba(40, 167, 69, 0.3)",
		opacity: 0.8,
	},
	tittleTextSurvey: {
		color: colors.white,
		fontSize: 18,
		fontWeight: "bold",
		letterSpacing: 0.3,
	},
	tittleTextSurveyDesktop: {
		fontSize: 22,
	},
	textoEstado: {
		fontSize: 14,
		marginTop: 6,
		color: colors.textSecondary,
	},

	botonResultados: {
		backgroundColor: "rgba(91, 85, 192, 0.08)",
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: colors.primary,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	textoBotonResultados: {
		color: colors.primary,
		fontWeight: "bold",
		fontSize: 12,
	},

	inputTitulo: {
		fontSize: 24,
		fontWeight: "bold",
		color: colors.text,
		paddingVertical: 10,
		borderBottomWidth: 2,
		borderBottomColor: colors.primary,
		marginBottom: 20,
		width: "100%",
	},

	headerAndroid: { marginBottom: 25, paddingTop: 10 },
	saludoAndroid: {
		color: colors.textMain,
		opacity: 0.6,
		fontSize: 16,
		marginBottom: 4,
	},
	containerStats: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 30,
	},
	cardStat: {
		flex: 1,
		backgroundColor: colors.darkCard,
		padding: 16,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: colors.borderDark,
		marginHorizontal: 4,
		elevation: 4,
	},
	statNumber: { fontSize: 24, fontWeight: "bold", color: colors.white },
	statLabel: {
		fontSize: 12,
		color: colors.textMain,
		opacity: 0.5,
		marginTop: 4,
		textTransform: "uppercase",
		letterSpacing: 1,
	},
	cajaEncuestasAndroid: {
		backgroundColor: "#1A1A1A",
		borderRadius: 20,
		padding: 20,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.08)",
		flexDirection: "row",
		alignItems: "center",
		elevation: 5,
	},
	iconContainerAndroid: {
		width: 45,
		height: 45,
		borderRadius: 12,
		backgroundColor: "rgba(59, 130, 246, 0.15)",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 15,
	},
	badgeAndroid: {
		backgroundColor: "rgba(139, 195, 74, 0.15)",
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "rgba(139, 195, 74, 0.3)",
	},
	floatingBtnContainer: {
		position: "absolute",
		bottom: 20,
		right: 20,
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: colors.cta,
		justifyContent: "center",
		alignItems: "center",
		elevation: 8,
	},
	dot: {
		width: 4,
		height: 4,
		borderRadius: 2,
		backgroundColor: colors.secondary,
		marginHorizontal: 8,
	},
    disabled: {
        opacity: 0.5,
    },
    labelCustom: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 5,
        fontWeight: "600",
    },

	borde: { borderWidth: 1, borderColor: "red" },
	borde2: { borderWidth: 1, borderColor: "green" },
	borde3: { borderWidth: 1, borderColor: "orange" },
	margen2: { marginTop: 20 },
	row: { flexDirection: "row", alignItems: "center" },
	fullWidth: { width: "100%" },
	maxWidth: { width: "100%" },
	maxHeigth: { height: "100%" },
	noJustify: { justifyContent: "flex-start" },
});
