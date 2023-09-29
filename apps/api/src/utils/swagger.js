import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options = {
  failOnErrors: true,
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'CStag API',
      description: 'Api do cstag todas as operações',
      version: '1.0.0',
    },
    components: {
      securitySchemas: {
        bearerAuth: {
          type: 'http',
          schema: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/components/**/*-routes.js', './src/components/**/*-schema.js']
};

const swaggerSpec = swaggerJsdoc(options)

export function swaggerDocs(app) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })

  console.log('Docs available');
}
