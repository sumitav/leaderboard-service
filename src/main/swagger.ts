import swaggerJsdoc, { Options } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LeaderBoard Service API',
      version: '1.0.0',
      description: 'API documentation for the leaderboard service',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        playerScore: {
          type: 'object',
          properties: {
            player_id: {
              type: 'string',
              description: 'ID of the player',
            },
            score: {
              type: 'integer',
              description: 'Score of the player',
            },
          },
          required: ['player_id', 'score'],
        },
        InputForLeaderBoard: {
          type: 'object',
          properties: {
            boardID: {
              type: 'string',
              description: 'ID of the leaderboard',
            },
            leaderBoardSize: {
              type: 'integer',
              description: 'Size of the leaderboard',
            },
          },
          required: ['boardID', 'leaderBoardSize'],
        },
      },
    },
  },
  apis: ['src/main/routes/*.ts'],
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };