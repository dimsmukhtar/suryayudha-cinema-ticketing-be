import path from 'path'
import YAML from 'yamljs'
import swaggerUI from 'swagger-ui-express'
import { Application } from 'express'

export function setupSwagger(app: Application) {
  const openapiPath = path.join(__dirname, 'openapi.yaml')

  const swaggerDocument = YAML.load(openapiPath)
  app.use(
    '/docs',
    swaggerUI.serve,
    swaggerUI.setup(swaggerDocument, {
      explorer: true,
      customCss: `
        .swagger-ui .topbar { display: none }
      `,
      customSiteTitle: 'Surya Yudha Cinema API Docs'
    })
  )
}
