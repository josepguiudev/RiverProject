import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#1C1C1C',
    borderRadius: 8,
    padding: 8,
    maxHeight: '20%',
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 12,
    color: '#FFFFFF',
  },
});