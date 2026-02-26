import React, { useEffect, useState } from "react";
import { View, Alert, ActivityIndicator } from "react-native";
import styles from "./styles";
import globalStyles from "@/assets/globalStyles/globalStyles";
import TypeWriter from "react-native-typewriter";

import CustomDropdown from '@/app/components/CustomDropDown/CustomDropDown';
import CustomInputText from "../CustomInputText/CustomInputText";
import CustomButton from "../CustomButton/CustomButton";

import strings from "../../../assets/supportFiles/strings.json";

import type {Option}  from '@/app/components/CustomDropDown/CustomDropDown';

import Constants from 'expo-constants';


type Props = {
    title: string;
    value: number;
};

type SteamQuery = {
    id: number;
    description: string;
    query: string;
    type: number;
};

const CustomInputCard = ({ title, value}: Props) => {
    const [queries, setQueries] = useState<SteamQuery[]>([]);
    const [queries2, setQueries2] = useState<SteamQuery[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
    const [inputUserId, setInputUserId] = useState("");

    useEffect(() => {
        const cargarQueries = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/queries/bytype1"); 

                if (!response.ok) {
                    throw new Error("Error al obtener queries");
                }

                const data: SteamQuery[] = await response.json();

                //const soloStrings = data.map(item => item.query);
                setQueries(data);

            } catch (error) {
                console.error(error);
                Alert.alert("Error", "No se pudieron cargar las consultas");
            } finally {
                setLoading(false);
            }
        };

        const cargarQueriesType2 = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/queries/bytype2"); 
                if (!response.ok) {
                    throw new Error("Error al obtener queries");
                }
                const data: SteamQuery[] = await response.json();
                setQueries2(data);
            } catch (error) {
                console.error(error);
                Alert.alert("Error", "No se pudieron cargar las consultas");
            } finally {
                setLoading(false);
            }
        };

        cargarQueries();
        cargarQueriesType2();
    }, []);

    const buscarPeticion = async () => {
        console.log("clic")
        if (!selectedOption || !inputUserId) {
        Alert.alert("Error", "Selecciona una consulta e introduce un ID");
        return;
        }

        console.log("ID Query:", selectedOption.id);
        console.log("Query seleccionada:", selectedOption.value);
        console.log("Descripción:", selectedOption.label);
        console.log("Descripción:", Constants.expoConfig?.extra?.STEAM_API_KEY);
        console.log("ID Usuario:", inputUserId);

        try{
            if(selectedOption.value === strings.GetPlayerSummaries){
                console.log(`${strings.parte1Desktop}${strings.parte2MappingIntroducido}${strings.parametroSteamApiKey}${Constants.expoConfig?.extra?.STEAM_API_KEY}${strings.conjugacion}${strings.parametroSteamId}${inputUserId}`);
                const response = await fetch(
                `${strings.parte1Desktop}${strings.parte2MappingIntroducido}${strings.parametroSteamApiKey}${Constants.expoConfig?.extra?.STEAM_API_KEY}${strings.conjugacion}${strings.parametroSteamId}${inputUserId}`
                );
                if (!response.ok) {
                    throw new Error("Error al llamar al backend");
                }

                const data = await response.json();
                console.log("Respuesta Steam:", data.response.players);
                Alert.alert("OK", "Usuario obtenido correctamente");
            }else if (selectedOption.value === strings.GetFriendList){
                console.log(`${strings.parte1Desktop}${strings.parte21MappingIntroducido}${strings.parametroSteamApiKey}${Constants.expoConfig?.extra?.STEAM_API_KEY}${strings.conjugacion}${strings.parametroSteamId}${inputUserId}`);
                const response = await fetch(
                `${strings.parte1Desktop}${strings.parte21MappingIntroducido}${strings.parametroSteamApiKey}${Constants.expoConfig?.extra?.STEAM_API_KEY}${strings.conjugacion}${strings.parametroSteamId}${inputUserId}`
                );
                if (!response.ok) {
                    throw new Error("Error al llamar al backend");
                }

                const data = await response.json();
                console.log("Respuesta Steam:", data.response.players);
                Alert.alert("OK", "Usuario obtenido correctamente");
            }
            
        }catch(error){
            console.error(error);
            Alert.alert("Error", "No se pudo obtener el usuario");
        }
    }

    const buscarPeticion2 = async () => {
        console.log("clic")
        if (!selectedOption) {
        console.log("No se ha seleccionado ninguna opción");
        return;
        }

    console.log("ID Query:", selectedOption.id);
    console.log("Query seleccionada:", selectedOption.value);
    console.log("Descripción:", selectedOption.label);
    console.log("Descripción:", Constants.expoConfig?.extra?.STEAM_API_KEY);
    console.log("ID Usuario:", inputUserId);
    }

    let content; 

    switch (value) {
        case 1: 
            content = (
                <View style={[styles.cardSize, styles.back]}>
                    <View style={[styles.contenedorWritter]}>
                        <View style={[styles.textWrapper]}>
                            <TypeWriter 
                                typing={1}  
                                maxDelay={50}
                                style={styles.mainText}
                            >
                                {title}
                            </TypeWriter>
                        </View>
                    </View>

                    <View style={[styles.contenedorSecundario, globalStyles.alineadoPersonalHorizontal]}>
                        <View style={[styles.contenedorInterno]}>
                            {loading ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                <CustomDropdown label="Seleccione una consulta" options={queries.map(q => ({
                                    id: q.id,
                                    label: q.description,   //  LO QUE SE MUESTRA
                                    value: q.query          //  LO QUE REALMENTE USAS
                                }))} 
                                onSelect={item => setSelectedOption(item)}/>
                            )}
                        </View>
                        <View style={[styles.contenedorInterno2]}>
                            <CustomInputText placeholder="Inserta el id del usuario" isAdmin={true} onChangeText={setInputUserId}/>
                        </View>
                    </View>

                    <View style={[styles.contenedorTerciario, globalStyles.alineadoPersonal]}>
                        <CustomButton title="Buscar" onPress={buscarPeticion} isAdmin={true}  />
                    </View>

                </View>
            );
            break;
        case 2:
            content = (
                <View style={[styles.cardSize, styles.back]}>
                    <View style={[styles.contenedorWritter]}>
                        <View style={[styles.textWrapper]}>
                            <TypeWriter 
                                typing={1}  
                                maxDelay={50}
                                style={styles.mainText}
                            >
                                {title}
                            </TypeWriter>
                        </View>
                    </View>

                    <View style={[styles.contenedorSecundario, globalStyles.alineadoPersonalHorizontal]}>
                        <View style={[styles.contenedorInterno]}>
                            {loading ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                <CustomDropdown label="Seleccione una consulta" options={queries2.map(q => ({
                                    id: q.id,
                                    label: q.description,   //  LO QUE SE MUESTRA
                                    value: q.query          //  LO QUE REALMENTE USAS
                                }))} 
                                onSelect={item => setSelectedOption(item)}/>
                            )}
                        </View>
                        <View style={[styles.contenedorInterno2]}>
                            <CustomInputText placeholder="Inserta el id del juego" isAdmin={true} onChangeText={setInputUserId}/>
                        </View>
                    </View>

                    <View style={[styles.contenedorTerciario, globalStyles.alineadoPersonal]}>
                        <CustomButton title="Buscar" onPress={buscarPeticion2} isAdmin={true}  />
                    </View>

                </View>
            );
            break;
        default: 
            content = <View/>
        }
        return (content);
}

export default CustomInputCard;