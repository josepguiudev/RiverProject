// index.js
import { registerRootComponent } from 'expo';

import App from './app/App';

// registerRootComponent llama a AppRegistry.registerComponent internamente
// Esto asegura que la app cargue App.tsx como raíz.
registerRootComponent(App);