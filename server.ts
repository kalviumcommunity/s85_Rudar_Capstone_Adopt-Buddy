import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { seedDatabase } from './server/seed.js';

// Import routes (to be created)
import authRoutes from './server/routes/auth.routes.js';
import userRoutes from './server/routes/user.routes.js';
import petRoutes from './server/routes/pet.routes.js';
import requestRoutes from './server/routes/request.routes.js';
import chatRoutes from './server/routes/chat.routes.js';

// Import middleware
import { errorHandler } from './server/middleware/error.middleware.js';

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const PORT = Number(process.env.PORT) || 3000;

  // Socket.IO setup
  const io = new Server(httpServer, {
    cors: {
      origin: true, // Reflect the request origin
      credentials: true,
    },
  });

  // Attach io to app for use in controllers
  app.set('io', io);

  // Rate Limiting
  app.set('trust proxy', 1); // Trust first proxy
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
    validate: { xForwardedForHeader: false }
  });

  // Middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for Vite dev server
  }));
  app.use('/api', limiter); // Apply rate limiting to API routes
  app.use(cors({
    origin: true, // Reflect the request origin
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(morgan('dev'));

  // Database connection
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to MongoDB');
      await seedDatabase();
    } catch (error) {
      console.error('MongoDB connection error:', error);
    }
  } else {
    console.warn('MONGODB_URI not set. Using in-memory MongoDB for preview.');
    try {
      const mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log('Connected to in-memory MongoDB');
      await seedDatabase();
    } catch (error) {
      console.error('In-memory MongoDB connection error:', error);
    }
  }

  // Socket.IO connection handling
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join_chat', (chatId) => {
      socket.join(chatId);
      console.log(`User joined chat: ${chatId}`);
    });

    socket.on('send_message', (data) => {
      // Broadcast to the specific chat room
      io.to(data.chatId).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Adopt Buddy API is running' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/pets', petRoutes);
  app.use('/api/requests', requestRoutes);
  app.use('/api/chats', chatRoutes);

  // Error handling middleware
  app.use(errorHandler);

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
