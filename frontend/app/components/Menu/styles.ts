import { StyleSheet, Platform, Dimensions } from 'react-native';
import { isWeb } from './../../utils/device';

export default StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.85)',
        zIndex: 9999,
        flexDirection: 'row',
    },
    background: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    menuContainer: {
        height: '100%',
        backgroundColor: '#171a21',
        padding: isWeb ? 15 : 20,
        paddingTop: isWeb ? 50 : Platform.OS === 'android' ? 40 : 60,
        borderRightWidth: 1.5,
        borderRightColor: '#1b2838',
        ...Platform.select({
            android: {
                elevation: 15,
            },
            default: {
                elevation: 10,
            }
        }),
    },
    title: {
        color: 'white',
        fontSize: isWeb ? 18 : 22,
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-condensed'
    },
    linea: {
        height: 1,
        backgroundColor: '#333',
        marginVertical: isWeb ? 15 : 20,
    },
    itemContenedor: {
        paddingVertical: isWeb ? 12 : 16,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginVertical: 4,
        ...Platform.select({
            android: {
                paddingVertical: 14, // más alto para dedos
                marginVertical: 6,
            }
        })
    },
    itemHover: {
        backgroundColor: '#3b6bbf33',
        borderLeftWidth: 3,
        borderLeftColor: '#66c0f4',
    },
    item: {
        color: '#dcdedf',
        fontSize: isWeb ? 13 : 16,
        fontWeight: '500',
    },
    itemTextHover: {
        color: '#ffffff',
    },
});