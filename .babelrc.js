const presets = ["razzle/babel", "@linaria"];
const plugins = [
  "effector/babel-plugin",
  [
    "transform-rename-import",
    {
      replacements: [
        { original: "effector-react$", replacement: "effector-react/scope" },
        {
          original: "@effector/reflect$",
          replacement: "@effector/reflect/ssr",
        },
      ],
    },
  ],
];

module.exports = {
  presets,
  plugins,
};
