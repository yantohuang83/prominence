// craco.config.js
const path = require("path");
require("dotenv").config();

const config = {
  enableHealthCheck: process.env.ENABLE_HEALTH_CHECK === "true",
};

let WebpackHealthPlugin;
let setupHealthEndpoints;
let healthPluginInstance;

if (config.enableHealthCheck) {
  WebpackHealthPlugin = require("./plugins/health-check/webpack-health-plugin");
  setupHealthEndpoints = require("./plugins/health-check/health-endpoints");
  healthPluginInstance = new WebpackHealthPlugin();
}

const webpackConfig = {
  eslint: {
    configure: {
      extends: ["plugin:react-hooks/recommended"],
      rules: {
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
      },
    },
  },
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    configure: (config) => {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          "**/node_modules/**",
          "**/.git/**",
          "**/build/**",
          "**/dist/**",
          "**/coverage/**",
          "**/public/**",
        ],
      };

      if (healthPluginInstance) {
        config.plugins.push(healthPluginInstance);
      }

      return config;
    },
  },
};

webpackConfig.devServer = (devServerConfig) => {
  const onBefore = devServerConfig.onBeforeSetupMiddleware;
  const onAfter = devServerConfig.onAfterSetupMiddleware;

  if (onBefore || onAfter) {
    const prevSetup = devServerConfig.setupMiddlewares;
    devServerConfig.setupMiddlewares = (middlewares, devServer) => {
      if (onBefore) {
        try {
          onBefore(devServer);
        } catch {
          // Keep CRA compatibility middleware best-effort only.
        }
      }

      const next = prevSetup ? prevSetup(middlewares, devServer) : middlewares;

      if (onAfter) {
        try {
          onAfter(devServer);
        } catch {
          // Keep CRA compatibility middleware best-effort only.
        }
      }

      return next;
    };
    delete devServerConfig.onBeforeSetupMiddleware;
    delete devServerConfig.onAfterSetupMiddleware;
  }

  if (devServerConfig.https !== undefined) {
    const useHttps = !!devServerConfig.https;
    devServerConfig.server = {
      type: useHttps ? "https" : "http",
      ...(typeof devServerConfig.https === "object" ? { options: devServerConfig.https } : {}),
    };
    delete devServerConfig.https;
  }

  [
    "clientLogLevel",
    "contentBase",
    "contentBasePublicPath",
    "publicPath",
    "inline",
    "lazy",
    "socket",
    "stats",
    "watchContentBase",
    "before",
    "after",
  ].forEach((key) => {
    if (key in devServerConfig) delete devServerConfig[key];
  });

  if (config.enableHealthCheck && setupHealthEndpoints && healthPluginInstance) {
    const originalSetupMiddlewares = devServerConfig.setupMiddlewares;

    devServerConfig.setupMiddlewares = (middlewares, devServer) => {
      if (originalSetupMiddlewares) {
        middlewares = originalSetupMiddlewares(middlewares, devServer);
      }

      setupHealthEndpoints(devServer, healthPluginInstance);
      return middlewares;
    };
  }

  return devServerConfig;
};

module.exports = webpackConfig;
