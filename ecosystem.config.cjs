module.exports = {
  apps: [{
    name: 'CGPE - Docs',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
