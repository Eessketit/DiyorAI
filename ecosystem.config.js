module.exports = {
  apps: [
    {
      name: "diyorai-web",
      script: "npm",
      args: "run start",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
