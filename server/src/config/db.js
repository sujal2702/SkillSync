import mongoose from 'mongoose';

export async function connectDB() {
  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('Attempting to connect to MongoDB...');
    
    // Set mongoose options
    mongoose.set('strictQuery', true);
    
    // Connection options
    const options = {
      autoIndex: true,
      serverSelectionTimeoutMS: process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || 5000,
      socketTimeoutMS: process.env.MONGODB_SOCKET_TIMEOUT_MS || 45000,
      connectTimeoutMS: process.env.MONGODB_CONNECTION_TIMEOUT_MS || 30000,
      retryWrites: true,
      w: 'majority'
    };

    // Set up event handlers before connecting
    mongoose.connection.on('connecting', () => {
      console.log('Connecting to MongoDB...');
    });

    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connected successfully');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('ℹ️  MongoDB disconnected');
    });

    // Connect to MongoDB
    await mongoose.connect(uri, options);
    
    console.log(`MongoDB connection state: ${mongoose.connection.readyState} (1 = connected, 2 = connecting, 3 = disconnecting, 0 = disconnected)`);
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
    // Handle process termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    // Exit process with failure
    process.exit(1);
  }
}
