import { defineConfig } from '@adonisjs/cors'

/**
 * Configuration options to tweak the CORS policy. The following
 * options are documented on the official documentation website.
 *
 * https://docs.adonisjs.com/guides/security/cors
 */
const corsConfig = defineConfig({
    enabled: true,
    origin: ['http://localhost:8080', 'http://localhost:3000', 'http://capstone24.sit.kmutt.ac.th:80/pl2'],
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH'],
    headers: true,
    exposeHeaders: [],
    credentials: true,
    maxAge: 90,
})

export default corsConfig
