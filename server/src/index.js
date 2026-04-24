const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const authRoutes = require('./routes/auth');
const journalRoutes = require('./routes/journals');
const friendRoutes = require('./routes/friends');

const app = express();

app.use(cors());
app.use(express.json());

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: '个人日记 API',
      version: '1.0.0',
      description: '个人日记应用后端接口文档',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes);
app.use('/api/journals', journalRoutes);
app.use('/api/friends', friendRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(9000, () => {
  console.log('Server running on http://localhost:9000');
});
