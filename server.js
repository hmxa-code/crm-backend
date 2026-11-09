import 'dotenv/config'; // Load environment variables from .env file
import app from './app.js';
import connectDB from './src/config/db.js';

const PORT = process.env.PORT || 5000;

/**
 * Connect to MongoDB and Startup Server for local development
 */
const startServer = async () => {
  try {
    await connectDB();

    // Start Express Application Server
    app.listen(PORT, () => {
      console.log(`[Server]: Server is running high on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ [Database Connection Error]:', error.message);
    process.exit(1);
  }
};

// Initiate Lifecycle
startServer();

export default app;
