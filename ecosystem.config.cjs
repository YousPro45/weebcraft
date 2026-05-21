// PM2 ecosystem config — runs Next.js dev server as a background daemon.
// On Windows, PM2 cannot use "npm" as script because npm.cmd is a batch file
// and Node.js rejects it with "SyntaxError: Unexpected token ':'".
// Fix: invoke the Next.js binary directly so PM2 runs it via Node.js.
//
// Commands:
//   Start  : npm run pm2:start
//   Stop   : npm run pm2:stop
//   Restart: npm run pm2:restart
//   Logs   : npm run pm2:logs
//   Status : npm run pm2:status
module.exports = {
  apps: [
    {
      name: "webcraft",
      // Direct path to Next.js binary — avoids npm.cmd on Windows
      script: "node_modules/next/dist/bin/next",
      args: "dev",
      cwd: __dirname,
      watch: false,          // Next.js has its own HMR watcher
      autorestart: true,
      max_restarts: 5,
      restart_delay: 3000,
      env: {
        NODE_ENV: "development",
        PORT: "3000",
      },
      out_file: "./logs/out.log",
      error_file: "./logs/error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
