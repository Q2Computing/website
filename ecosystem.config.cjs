module.exports = {
  apps: [
    {
      name: "q2-preview",
      script: "./node_modules/vite/bin/vite.js",
      args: "preview --port 4173",
      cwd: "C:\\Users\\jcada\\Documents\\Q2-Computing\\website",
      interpreter: "node",
      watch: false,
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
      },
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
