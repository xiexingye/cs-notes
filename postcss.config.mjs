// Tailwind CSS v4 通过 PostCSS 插件接入。
// 注意：v4 不再需要 tailwind.config.js，主题变量写在 app/globals.css 的 @theme 里。
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
