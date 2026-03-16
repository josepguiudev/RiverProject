import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Animated } from "react-native";
import TypeWriter from "react-native-typewriter";
import styles from "./styles";
import globalStyles from "@/assets/globalStyles/globalStyles";
import CustomButton from "@/app/components/CustomButton/CustomButton";
import CustomInputText from "@/app/components/CustomInputText/CustomInputText";
import strings from "../../../assets/supportFiles/strings.json";


export default function RegisterScreen({ navigation }: any) {
  const cursorOpacity = React.useRef(new Animated.Value(1)).current;
  
  // Animación del cursor parpadeante
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(cursorOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, [] );  

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");

  const handleRegister = async () => {
    if(password === repassword){
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        alert(strings.alertErrorRegistrar);
        return;
      }

      alert(strings.alertCreaUser);
      //navigation.navigate("Login");
      navigation.navigate("Login")
    }else{
      alert(strings.alertNotSamePassword);
    }
  };

  return (
      <View style={[styles.maxWidth, styles.maxHeigth, globalStyles.padre]}>
      <View style={[styles.contendorLogoTitulos]}>
        <View style={[styles.containerFoto]}>
          <Image 
            source={require('../../../assets/images/logo.png')} 
            style={styles.logo} 
          />
        </View>
        <View style={[styles.contenedorWritter, styles.alineadoPersonal]}>
          <Text style={styles.tituloHero}>
            {strings.nameMayus}{" "} 
            <TypeWriter typing={1} style={styles.destaqueAzul}>
              {strings.appMayus}
            </TypeWriter>
          </Text>
        </View>
      </View>
      <View style={[styles.contenedorWritter]}>
        <View style={styles.textWrapper}>
          <TypeWriter 
            typing={1} 
            maxDelay={50}
            style={styles.mainText}
          >
            {strings.tittle1} <Text style={styles.blueText}>{strings.tittle2}</Text>
          </TypeWriter>
          
          {/* El cursor va fuera para que siempre esté al final */}
          <Animated.View style={[styles.cursor, { opacity: cursorOpacity }]} />
        </View>
      </View>
      {/* Parte del recuadro del login */}
      <View style={[styles.alineadoPersonal, styles.maxHeigth, styles.noJustify]}>
        <View style={[styles.caja, styles.margen2]}>
          <CustomInputText label={strings.direccionEmail} placeholder={strings.placeEmail} onChangeText={setEmail} value={email}/>
          <CustomInputText label={strings.contrasenia} placeholder={strings.placePassword} secureTextEntry onChangeText={setPassword} value={password}/>
          <CustomInputText label={strings.repetirContrasenia} placeholder={strings.placePassword} secureTextEntry onChangeText={setRepassword}/>
          <CustomButton title={strings.registrar} onPress={handleRegister} />
          <View style={[styles.maxWidth, styles.margen1]}>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={[styles.texto, styles.alineadoPersonal]}>¿Ya tienes cuenta? Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
    </View>
  );
}
