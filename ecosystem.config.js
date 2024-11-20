module.exports = {
    apps: [
      {
        name: "worldbooks-api",
        script: "dist/main.js",
        env: {
          NODE_ENV: "production",
          DOTENV_CONFIG_PATH: "./.env.production"
        }
      }
    ]
  };