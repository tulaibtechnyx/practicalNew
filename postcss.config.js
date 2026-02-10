module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    "postcss-flexbugs-fixes": {},
    "postcss-preset-env": {
      browsers: "last 2 versions",
      stage: 3,
      features: {
        "nesting-rules": true
      }
    },
    "postcss-rtl": {}
  }
}
