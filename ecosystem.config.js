module.exports = {
  apps: [
    {
      name: "node-backend-v2",
      script: "./dist/index.js",
      exec_mode: "cluster",
      instances: 1,
      autorestart: true,
      max_memory_restart: '1G',
      output: "./logs/pm2-out.log",
      error: "./logs/pm2-error.log",
      merge_logs: true,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
