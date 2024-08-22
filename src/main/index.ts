import express from 'express';
import { swaggerUi, specs } from './swagger';
import gameRoutes from '../main/routes/game.routes';
import leaderBoardRoutes from '../main/routes/leaderBoard.routes';
import logger from '../main/config/logger';
import sequelize from './config/databaseConfig';
import healthController from './controllers/healthController';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes

app.use('/api/game', gameRoutes);
app.use('/api/leaderboard', leaderBoardRoutes);
app.get('/health', healthController.check);
//
sequelize.sync().then(() => {
  app.listen(port, () => {
    
    logger.info(`Your wonderful server is running in port: ${port} !!!`);
  });
}).catch((err:Error) => {
  if(err instanceof Error){
  logger.error('Unable to connect to the database:', err);
  }
});
export default app;