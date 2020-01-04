module.exports = {
  assetsDir: 'assets',
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/assets/scss/variables.scss";
          @import "@/assets/scss/_mixins.scss";
        `,
      },
    },
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.txt$/i,
          use: [{
            loader: 'raw-loader',
          }],
        },
      ],
    },
  },
};
