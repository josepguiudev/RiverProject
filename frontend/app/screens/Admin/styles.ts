import { StyleSheet } from 'react-native';
import { wp, hp } from '@/app/utils/device';

export default StyleSheet.create({
    cajaPrincipal: {
        width: wp(80),
        height: hp(80),
    },
    contenedorFila: {
        width: wp(33),
        height: hp(100),
        borderRadius: wp(5),
    }
})