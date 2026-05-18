import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { useLayout } from "@/app/utils/useLayout";
import { colors } from "./stylesGlobal";
import { AnalyticsRenderer } from "../components/analytics/AnalyticsRenderer";
import { isWeb } from "../utils/device";

export default function SurveyAnalyticsScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { isDesktopView } = useLayout();
  const { surveyId, title } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [surveyData, setSurveyData] = useState<any[]>([]);

  const neutralFont = Platform.OS === "ios" ? "System" : "sans-serif";

  useEffect(() => {
    // Simulación de carga de datos dinámicos del backend
    const fetchStats = () => {
      setTimeout(() => {
        const mockData = [
          {
            id: "q1",
            type: "NUMERIC",
            title: "Valoración general del evento",
            average: 8.4,
            max: 10,
          },
          {
            id: "q2",
            type: "SINGLE_CHOICE",
            title: "¿Cuál fue tu zona favorita?",
            results: [
              { label: "Zona Pro-Gaming", votes: 450 },
              { label: "Área Retro", votes: 320 },
              { label: "Stand de Comida", votes: 120 },
            ],
          },
          {
            id: "q3",
            type: "MULTIPLE_CHOICE",
            title: "¿Qué consolas tienes en casa?",
            totalParticipants: 890,
            results: [
              { label: "PlayStation 5", votes: 600 },
              { label: "PC Master Race", votes: 750 },
              { label: "Nintendo Switch", votes: 400 },
            ],
          },
          {
            id: "q4",
            type: "SHORT_TEXT",
            title: "Sugerencias de los usuarios",
            responses: [
              "Más sillas en la zona de descanso",
              "El torneo de LoL empezó tarde",
              "Increíble la decoración neón",
            ],
          },
        ];
        setSurveyData(mockData);
        setLoading(false);
      }, 1000);
    };

    fetchStats();
  }, [surveyId]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0e0d0df1",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.white, marginTop: 20, fontFamily: neutralFont }}>
          Calculando estadísticas...
        </Text>
      </View>
    );
  }

  // ============================================================
  //  VERSIÓN WEB (original, sin cambios)
  // ============================================================
  if (isWeb) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#0e0d0df1" }}>
        {/* Header Fijo */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: "#222",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginRight: 15, padding: 5 }}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 12,
                textTransform: "uppercase",
              }}
            >
              Resultados en tiempo real
            </Text>
            <Text
              style={{ color: colors.white, fontSize: 20, fontWeight: "800" }}
            >
              {title || "Detalle de Encuesta"}
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{
            padding: isDesktopView ? 40 : 20,
            maxWidth: isDesktopView ? 1000 : "100%",
            alignSelf: isDesktopView ? "center" : "auto",
          }}
        >
          {/* Renderizado Automático de Gráficos */}
          {surveyData.map((pregunta) => (
            <AnalyticsRenderer key={pregunta.id} question={pregunta} />
          ))}

          {/* Footer / Acción */}
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              padding: 18,
              borderRadius: 15,
              alignItems: "center",
              marginTop: 20,
              marginBottom: 40,
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              GENERAR REPORTE PDF
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ============================================================
  //  VERSIÓN ANDROID (diseño táctil, optimizado)
  // ============================================================
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0e0d0df1" }}>
      {/* Header con botón de volver y título */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: "#222",
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ padding: 8, marginRight: 8 }}
        >
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 12,
              textTransform: "uppercase",
            }}
          >
            Resultados en tiempo real
          </Text>
          <Text
            style={{
              color: colors.white,
              fontSize: 20,
              fontWeight: "800",
            }}
            numberOfLines={1}
          >
            {title || "Detalle de Encuesta"}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 40,
        }}
      >
        {surveyData.map((pregunta) => (
          <AnalyticsRenderer key={pregunta.id} question={pregunta} />
        ))}

        <TouchableOpacity
          style={{
            backgroundColor: colors.primary,
            paddingVertical: 16,
            borderRadius: 16,
            alignItems: "center",
            marginTop: 20,
            marginBottom: 20,
            elevation: 4,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
            GENERAR REPORTE PDF
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}