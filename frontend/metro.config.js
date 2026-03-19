const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Proxy para engañar a las librerías que buscan tty
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  tty: require.resolve('tty-browserify'),
};

// Forzar la resolución de debug a la versión de navegador SIEMPRE
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'debug') {
    return context.resolveRequest(context, 'debug/src/browser', platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

// Exportamos la configuración limpia de Expo, sin el envoltorio de Storybook
module.exports = config;


























/* OLD
const { getDefaultConfig } = require('expo/metro-config');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');

/** @type {import('expo/metro-config').MetroConfig} */
/*
const config = getDefaultConfig(__dirname);

// Proxy para engañar a las librerías que buscan tty
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  tty: require.resolve('tty-browserify'),
};

// Forzar la resolución de debug a la versión de navegador SIEMPRE
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'debug') {
    return context.resolveRequest(context, 'debug/src/browser', platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

// Esta función "envuelve" la configuración de Expo para que Storybook funcione
module.exports = withStorybook(config);
*/