import dotenv from 'dotenv';
import connectDB from './models/index.js';
import { app } from './app.js';

dotenv.config({
  path: './.env',
});

const PORT = process.env.PORT || 3500;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`⚙️  Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log('ERR while starting server ::', err);
  });
