const { withSentryConfig } = require("@sentry/nextjs");
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swMinify: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig = {
  reactStrictMode: false,
  distDir: "build",
  sassOptions: {
    includePaths: [require("path").join(__dirname, "style")]
  },
  output: "standalone",
  transpilePackages: ["@fancyapps/ui"],

  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    domains: [
      "localhost:3000",
      "blob.practical.me",
      "assets.practical.me"
    ]
  },
  compiler: {
    // This replaces babel-plugin-transform-remove-console
    removeConsole: process.env.NODE_ENV === "production",
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });
    return config;
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en"
  },
  staticPageGenerationTimeout: 100,
}

const SentryWebpackPluginOptions = {
  silent: true,
  hideSourceMaps: true,
};

// module.exports = withSentryConfig(nextConfig, SentryWebpackPluginOptions);
module.exports = withPWA(nextConfig);

