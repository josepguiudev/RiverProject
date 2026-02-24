import { StyleSheet, Platform } from 'react-native';
import { wp, hp, fontScale } from '@/app/utils/device';

export default StyleSheet.create({
    borde: {
        borderWidth: 1,
        borderColor: 'red',
        borderStyle: 'solid',
    },
    borde2: {
        borderWidth: 1,
        borderColor: 'green',
        borderStyle: 'solid',
    },
    borde3: {
        borderWidth: 1,
        borderColor: 'orange',
        borderStyle: 'solid',
    },
    cajaHome: {
        width: wp(90),
        height: hp(95),
    },
    cajaEncuestas: {
        width: wp(90),
        height: hp(23),
        backgroundColor: '#0e0d0df1',
        borderRadius: wp(5),
    },
    cajaTextoEncuestas: {
        width: wp(100),
        height: hp(4),
        paddingLeft: wp(2),
        display: 'flex',
        flexDirection: 'row',
    },
    cajaComponentesEncuestas: {
        width: wp(100),
        height: hp(19),
    },
    width98: {
        width: wp(98),
    },
    width2: {
        width: wp(2),
    },
    margin1: {
        margin: wp(1),
    },
    justify1: {
        justifyContent: 'space-between',
    },
    tittleTextSurvey: {
        color: '#fff',
        fontSize: fontScale(12),
        fontWeight: 'bold',
        textAlign: 'left',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-condensed',
    },
});