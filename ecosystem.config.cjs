module.exports = {
  apps: [{
    name: "palm-frontend",
    script: "./src/index.ts", // Run the source directly
    interpreter: "bun",       // Use Bun
    instances: 1,
    exec_mode: "fork"
  }]
}