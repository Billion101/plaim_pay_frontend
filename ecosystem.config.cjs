module.exports = {
  apps: [{
    name: "palm-payment-frontend",
    script: "bun",
    args: "run dev --host 0.0.0.0",
    instances: 1,
    exec_mode: "fork",
    env: {
      NODE_ENV: "development",
      PORT: 5173
    }
  }]
}