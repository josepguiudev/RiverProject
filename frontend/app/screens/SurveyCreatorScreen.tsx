import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Platform,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { FormApiService } from "../services/api/service";
import { useAuth } from "./Auth/AuthContext";
import { useLayout } from "@/app/utils/useLayout";
import { Survey } from "../types/formsSurvey.types";
import styles, { colors } from "./stylesGlobal";
import { ResponsiveLayout } from "../components/ResponsiveLayout";
import { isWeb } from "../utils/device";
import client from "../api/client";
import MenuPrincipal from "@/app/components/Menu/CustomMenu";

export default function ClientDashboard() {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();
  const { isDesktopView } = useLayout();

  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState<number | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const isAdmin = user?.role === "ADMIN";
  const neutralFont = Platform.OS === "ios" ? "System" : "sans-serif";

  const fetchSurveys = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await FormApiService.getSurveysByClient(user.id);
      setSurveys(data);
    } catch (error) {
      console.error("Error al cargar proyectos:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSurveys();
    }, [user?.id])
  );

  const handleLogout = () => {
    if (Platform.OS === "web") {
      const confirmLogout = window.confirm(
        "¿Estás seguro de que quieres cerrar sesión?"
      );
      if (confirmLogout) logout();
    } else {
      Alert.alert(
        "Cerrar Sesión",
        "¿Estás seguro de que quieres salir?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Salir", style: "destructive", onPress: () => logout() },
        ]
      );
    }
  };

  const handlePublish = async (surveyId: number) => {
    try {
      await FormApiService.publishSurvey(surveyId);
      Alert.alert("Éxito", "Encuesta publicada correctamente.");
      fetchSurveys();
    } catch (error) {
      Alert.alert("Error", "No se pudo publicar la encuesta.");
    }
  };

  const handleAssignToUsers = async (surveyId: number, numUsers: number) => {
    setAssigningId(surveyId);
    try {
      const response = await client.post(
        `/api/auth2/assign-survey/${surveyId}?limit=${numUsers}`
      );
      if (response.status === 200) {
        Alert.alert("Éxito", `Encuesta asignada a ${numUsers} usuarios.`);
        fetchSurveys();
      }
    } catch (error) {
      Alert.alert("Error", "Error en la asignación.");
    } finally {
      setAssigningId(null);
    }
  };

  const renderActionButtons = (item: Survey) => {
    const isPublished = item.status === true;

    return (
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 12,
          marginTop: 20,
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={[
            styles.botonResultados,
            { minWidth: 120, paddingHorizontal: 15, height: 45 },
          ]}
          onPress={() =>
            item.supersetID
              ? navigation.navigate("AdminGraphics", {
                  supersetID: item.supersetID,
                  title: item.name,
                })
              : Alert.alert("Aviso", "Sin dashboard vinculado.")
          }
        >
          <MaterialCommunityIcons
            name="chart-box-outline"
            size={20}
            color={colors.primary}
          />
          <Text
            style={[
              styles.textoBotonResultados,
              { fontFamily: neutralFont, marginLeft: 8 },
            ]}
          >
            ANÁLISIS
          </Text>
        </TouchableOpacity>

        {isAdmin ? (
          <>
            {!isPublished && (
              <TouchableOpacity
                style={[
                  styles.botonResultados,
                  {
                    borderColor: "#22C55E",
                    backgroundColor: "rgba(34, 197, 94, 0.1)",
                    minWidth: 120,
                    height: 45,
                  },
                ]}
                onPress={() => handlePublish(item.id!)}
              >
                <Ionicons name="rocket-outline" size={20} color="#22C55E" />
                <Text
                  style={[
                    styles.textoBotonResultados,
                    { color: "#22C55E", marginLeft: 8 },
                  ]}
                >
                  PUBLICAR
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.botonResultados,
                {
                  borderColor: colors.secondary,
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  minWidth: 120,
                  height: 45,
                },
              ]}
              onPress={() =>
                handleAssignToUsers(item.id!, item.numUsers || 0)
              }
              disabled={assigningId === item.id}
            >
              {assigningId === item.id ? (
                <ActivityIndicator size="small" color={colors.secondary} />
              ) : (
                <>
                  <Ionicons
                    name="person-add-outline"
                    size={20}
                    color={colors.secondary}
                  />
                  <Text
                    style={[
                      styles.textoBotonResultados,
                      {
                        color: colors.secondary,
                        fontWeight: "700",
                        marginLeft: 8,
                      },
                    ]}
                  >
                    ASIGNAR
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            {!isPublished && (
              <TouchableOpacity
                style={[
                  styles.botonResultados,
                  {
                    borderColor: "#EAB308",
                    backgroundColor: "rgba(234, 179, 8, 0.1)",
                    minWidth: 120,
                    height: 45,
                  },
                ]}
                onPress={() =>
                  navigation.navigate("SurveyCreator", { surveyEdit: item })
                }
              >
                <Ionicons name="create-outline" size={20} color="#EAB308" />
                <Text
                  style={[
                    styles.textoBotonResultados,
                    { color: "#EAB308", marginLeft: 8 },
                  ]}
                >
                  EDITAR
                </Text>
              </TouchableOpacity>
            )}

            {isPublished && (
              <View
                style={[
                  styles.botonResultados,
                  { borderColor: "gray", opacity: 0.6, minWidth: 120, height: 45 },
                ]}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color="gray"
                />
                <Text
                  style={[
                    styles.textoBotonResultados,
                    { color: "gray", marginLeft: 8 },
                  ]}
                >
                  ACTIVA
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    );
  };

  // ============================================================
  //  VERSIÓN WEB (exactamente igual al original)
  // ============================================================
  if (isWeb) {
    return (
      <SafeAreaView
        style={[
          styles.alineadoPersonal,
          { backgroundColor: colors.background, flex: 1 },
        ]}
      >
        <ResponsiveLayout fullWidth={true}>
          <ScrollView contentContainerStyle={{ padding: isWeb ? 40 : 20 }}>
            {/* CABECERA CON BOTÓN HAMBURGUESA */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 30,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 15,
                  flex: 1,
                }}
              >
                <TouchableOpacity
                  onPress={() => setMenuVisible(true)}
                  style={{ padding: 8 }}
                >
                  <Ionicons name="menu-outline" size={32} color="white" />
                </TouchableOpacity>

                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.tituloHero,
                      { textAlign: "left", marginBottom: 0 },
                    ]}
                  >
                    Panel de{" "}
                    <Text style={styles.destaqueAzul}>
                      {isAdmin ? "Administrador" : "Empresa"}
                    </Text>
                  </Text>
                  <Text style={{ color: "#888", marginTop: 5, fontSize: 14 }}>
                    {user?.email || "Bienvenido"}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleLogout}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "rgba(255, 59, 48, 0.1)",
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "rgba(255, 59, 48, 0.3)",
                }}
              >
                <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
                {isDesktopView && (
                  <Text
                    style={{
                      color: "#FF3B30",
                      fontWeight: "bold",
                      marginLeft: 8,
                      fontSize: 12,
                    }}
                  >
                    CERRAR SESIÓN
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* NUEVA ENCUESTA */}
            {!isAdmin && (
              <TouchableOpacity
                onPress={() => navigation.navigate("SurveyCreator")}
                style={[
                  styles.botonGrande,
                  { flexDirection: "row", gap: 10, marginBottom: 30 },
                ]}
              >
                <Ionicons name="add-circle" size={24} color="white" />
                <Text style={styles.textoBotonGrande}>NUEVA ENCUESTA</Text>
              </TouchableOpacity>
            )}

            {/* LISTADO DE ENCUESTAS */}
            {loading ? (
              <ActivityIndicator
                size="large"
                color={colors.primary}
                style={{ marginTop: 50 }}
              />
            ) : surveys.length > 0 ? (
              surveys.map((item) => (
                <View
                  key={item.id}
                  style={[styles.cajaEncuestas, { padding: 25, marginBottom: 20 }]}
                >
                  <Text style={[styles.tittleTextSurvey, { fontSize: 22 }]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.textoEstado, { marginTop: 8 }]}>
                    Estado:{" "}
                    <Text
                      style={{
                        fontWeight: "bold",
                        color: item.status ? "#22C55E" : "#EAB308",
                      }}
                    >
                      {item.status ? "ACTIVA" : "BORRADOR / PENDIENTE"}
                    </Text>
                  </Text>
                  {renderActionButtons(item)}
                </View>
              ))
            ) : (
              <View style={{ marginTop: 100, alignItems: "center" }}>
                <Ionicons name="document-text-outline" size={60} color="#333" />
                <Text style={{ color: "#666", marginTop: 15, fontSize: 16 }}>
                  No hay encuestas registradas.
                </Text>
              </View>
            )}
          </ScrollView>
        </ResponsiveLayout>

        <MenuPrincipal
          visible={menuVisible}
          onClose={() => setMenuVisible(false)}
          navigation={navigation}
        />
      </SafeAreaView>
    );
  }

  // ============================================================
  //  VERSIÓN ANDROID (diseño táctil, sin ResponsiveLayout)
  // ============================================================
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 }}
      >
        {/* Cabecera: menú hamburguesa y logout */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ padding: 8 }}>
            <Ionicons name="menu-outline" size={32} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLogout}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "rgba(255, 59, 48, 0.1)",
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 12,
            }}
          >
            <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
            <Text style={{ color: "#FF3B30", fontWeight: "bold", marginLeft: 6, fontSize: 12 }}>
              SALIR
            </Text>
          </TouchableOpacity>
        </View>

        {/* Título y email */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 28, fontWeight: "bold", color: colors.white }}>
            Panel de{" "}
            <Text style={{ color: colors.secondary }}>
              {isAdmin ? "Administrador" : "Empresa"}
            </Text>
          </Text>
          <Text style={{ color: "#aaa", fontSize: 14, marginTop: 4 }}>
            {user?.email || "Bienvenido"}
          </Text>
        </View>

        {/* Botón nueva encuesta (solo para no admin) */}
        {!isAdmin && (
          <TouchableOpacity
            onPress={() => navigation.navigate("SurveyCreator")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.primary,
              paddingVertical: 14,
              borderRadius: 16,
              marginBottom: 30,
              gap: 10,
            }}
          >
            <Ionicons name="add-circle" size={24} color="white" />
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
              NUEVA ENCUESTA
            </Text>
          </TouchableOpacity>
        )}

        {/* Lista de encuestas */}
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
        ) : surveys.length > 0 ? (
          surveys.map((item) => (
            <View
              key={item.id}
              style={{
                backgroundColor: "#161616",
                borderRadius: 20,
                padding: 18,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: "#333",
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.white }}>
                {item.name}
              </Text>
              <Text style={{ marginTop: 8, fontSize: 14, color: "#aaa" }}>
                Estado:{" "}
                <Text
                  style={{
                    fontWeight: "bold",
                    color: item.status ? "#22C55E" : "#EAB308",
                  }}
                >
                  {item.status ? "ACTIVA" : "BORRADOR / PENDIENTE"}
                </Text>
              </Text>

              {/* Botones táctiles */}
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(100, 181, 246, 0.1)",
                    borderWidth: 1,
                    borderColor: colors.primary,
                    borderRadius: 12,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    flex: 1,
                  }}
                  onPress={() =>
                    item.supersetID
                      ? navigation.navigate("AdminGraphics", {
                          supersetID: item.supersetID,
                          title: item.name,
                        })
                      : Alert.alert("Aviso", "Sin dashboard vinculado.")
                  }
                >
                  <MaterialCommunityIcons name="chart-box-outline" size={20} color={colors.primary} />
                  <Text style={{ color: colors.primary, fontWeight: "bold", marginLeft: 8 }}>
                    ANÁLISIS
                  </Text>
                </TouchableOpacity>

                {isAdmin ? (
                  <>
                    {!item.status && (
                      <TouchableOpacity
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "rgba(34, 197, 94, 0.1)",
                          borderWidth: 1,
                          borderColor: "#22C55E",
                          borderRadius: 12,
                          paddingVertical: 12,
                          paddingHorizontal: 16,
                          flex: 1,
                        }}
                        onPress={() => handlePublish(item.id!)}
                      >
                        <Ionicons name="rocket-outline" size={20} color="#22C55E" />
                        <Text style={{ color: "#22C55E", fontWeight: "bold", marginLeft: 8 }}>
                          PUBLICAR
                        </Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(59, 130, 246, 0.1)",
                        borderWidth: 1,
                        borderColor: colors.secondary,
                        borderRadius: 12,
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        flex: 1,
                      }}
                      onPress={() => handleAssignToUsers(item.id!, item.numUsers || 0)}
                      disabled={assigningId === item.id}
                    >
                      {assigningId === item.id ? (
                        <ActivityIndicator size="small" color={colors.secondary} />
                      ) : (
                        <>
                          <Ionicons name="person-add-outline" size={20} color={colors.secondary} />
                          <Text style={{ color: colors.secondary, fontWeight: "bold", marginLeft: 8 }}>
                            ASIGNAR
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    {!item.status && (
                      <TouchableOpacity
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "rgba(234, 179, 8, 0.1)",
                          borderWidth: 1,
                          borderColor: "#EAB308",
                          borderRadius: 12,
                          paddingVertical: 12,
                          paddingHorizontal: 16,
                          flex: 1,
                        }}
                        onPress={() =>
                          navigation.navigate("SurveyCreator", { surveyEdit: item })
                        }
                      >
                        <Ionicons name="create-outline" size={20} color="#EAB308" />
                        <Text style={{ color: "#EAB308", fontWeight: "bold", marginLeft: 8 }}>
                          EDITAR
                        </Text>
                      </TouchableOpacity>
                    )}

                    {item.status && (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "rgba(128, 128, 128, 0.1)",
                          borderWidth: 1,
                          borderColor: "gray",
                          borderRadius: 12,
                          paddingVertical: 12,
                          paddingHorizontal: 16,
                          flex: 1,
                          opacity: 0.6,
                        }}
                      >
                        <Ionicons name="checkmark-circle-outline" size={20} color="gray" />
                        <Text style={{ color: "gray", fontWeight: "bold", marginLeft: 8 }}>
                          ACTIVA
                        </Text>
                      </View>
                    )}
                  </>
                )}
              </View>
            </View>
          ))
        ) : (
          <View style={{ marginTop: 60, alignItems: "center" }}>
            <Ionicons name="document-text-outline" size={60} color="#666" />
            <Text style={{ color: "#aaa", marginTop: 15, fontSize: 16 }}>
              No hay encuestas registradas.
            </Text>
          </View>
        )}
      </ScrollView>

      <MenuPrincipal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        navigation={navigation}
      />
    </SafeAreaView>
  );
}