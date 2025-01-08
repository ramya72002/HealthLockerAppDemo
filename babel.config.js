module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          extensions: [".tsx", ".ts", ".js", ".json"],
        },
      ],
      "react-native-reanimated/plugin",
      [
        "@babel/plugin-transform-class-properties", 
        { loose: true } // Ensure loose is set to true
      ],
      [
        "@babel/plugin-transform-private-methods",
        { loose: true } // Ensure loose is set to true
      ],
      [
        "@babel/plugin-transform-private-property-in-object",
        { loose: true } // Ensure loose is set to true
      ]
    ],
  };
};
