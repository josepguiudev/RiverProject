import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, Alert } from 'react-native';

import globalStyles from "@/assets/globalStyles/globalStyles";
import styles from './styles';
import MenuPrincipal from '@/app/components/Menu/CustomMenu';
import strings from "../../../assets/supportFiles/strings.json";

export default function AdminUserScreen({ navigation }: any) {
    type Game = { 
        id: number, 
        name: string 
    };
    type UserBD = {
        id: number,
        avatar: string,
        avatarfull: string,
        avatarhash: string,
        avatarmedium: string,
        communityvisibilitystate: number,
        lastlogoff: number,
        personaname: string,
        personastate: number,
        personastateflags: number,
        primaryclanid: string,
        profilestate: number,
        profileurl: string,
        realname: string,
        steamid: string,
        timecreated: number,
        games: Game[]
    };

    const [menuVisible, setMenuVisible] = useState(false);
    const [usuariosBD, setUsuariosBD] = useState<UserBD[]>([]);
    const [loading, setLoading] = useState(true);
    
    {/*Funciones para extraer los datos de la bd*/}
    useEffect(()=>{
        const CargarAllUsers = async () => {
            try{
                setLoading(true);
                const response = await fetch("http://localhost:8080/api/usersteam/allUsers"); 

                if (!response.ok) {
                    throw new Error("Error al obtener los usuarios");
                }

                const data: UserBD[] = await response.json();
                setUsuariosBD(data);

                console.log(data);
            } catch (error) {
                console.error(error);
                Alert.alert("Error", "No se pudieron cargar los usuarios de la bd");
            } finally {
                setLoading(false);
            }    
        }

        CargarAllUsers();
    }, []);

    return (

        <View style={[globalStyles.padre, globalStyles.tamanoCajaPadre, globalStyles.borde]}>
            {/* 1. HEADER / BOTÓN MENU */}
            <View style={[globalStyles.cajaMenu, globalStyles.alineadoPersonalVertical]}>
                <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ padding: 20 }}>
                    <Text style={{ color: 'white' }}>{strings.menu}</Text>
                </TouchableOpacity>
            </View>

            {/*Creación del Crud de usuarios en nuestra app*/}
            <View style={[globalStyles.cajaMenu, globalStyles.alineadoPersonalVertical, globalStyles.borde2, {height: '100%'}]}>

            </View>

            {/* 3. MENU AL FINAL (FUERA DE TODO) */}
            <MenuPrincipal 
                visible={menuVisible} 
                onClose={() => setMenuVisible(false)} 
            />
        </View>

    );
}
