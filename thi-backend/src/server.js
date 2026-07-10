const app = require('./app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`\n\x1b[36m====================================================\x1b[0m`);
  console.log(`\x1b[36m    LEARTS E-COMMERCE BACKEND SERVER STARTED        \x1b[0m`);
  console.log(`\x1b[36m====================================================\x1b[0m`);
  console.log(`\x1b[32m[Server] Running on: http://localhost:${PORT}\x1b[0m`);
  console.log(`\x1b[32m[Server] Admin Panel: http://localhost:${PORT}/admin/login\x1b[0m`);
  console.log(`\x1b[36m====================================================\n\x1b[0m`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`\x1b[31m[Unhandled Rejection] Error: ${err.message}\x1b[0m`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
