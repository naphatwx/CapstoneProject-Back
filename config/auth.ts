import User from '#models/user'
import { defineConfig } from '@adonisjs/auth'
import { sessionGuard, sessionUserProvider } from '@adonisjs/auth/session'
import type { InferAuthEvents, Authenticators } from '@adonisjs/auth/types'
import { jwtGuard } from '@maximemrf/adonisjs-jwt/jwt_config'
import { BaseJwtContent, JwtGuardUser } from '@maximemrf/adonisjs-jwt/types'

interface JwtContent extends BaseJwtContent {
    email: string
}

const authConfig = defineConfig({
    default: 'jwt',
    guards: {
        web: sessionGuard({
            useRememberMeTokens: false,
            provider: sessionUserProvider({
                model: () => import('#models/user')
            }),
        }),
        jwt: jwtGuard({
            tokenExpiresIn: '8h',
            useCookies: false,
            provider: sessionUserProvider({
                model: () => import('#models/user'),
            }),
            content: (user: JwtGuardUser<User>): JwtContent => ({
                userId: user.getId(),
                email: user.getOriginal().email,
            }),
        })
    },
})

export default authConfig

/**
 * Inferring types from the configured auth
 * guards.
 */
declare module '@adonisjs/auth/types' {
    export interface Authenticators extends InferAuthenticators<typeof authConfig> { }
}
declare module '@adonisjs/core/types' {
    interface EventsList extends InferAuthEvents<Authenticators> { }
}
