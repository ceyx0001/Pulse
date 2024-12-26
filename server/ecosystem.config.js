module.exports = {
  apps: [
    {
      name: "pulse",
      script: "npm",
      args: "run dev",
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
