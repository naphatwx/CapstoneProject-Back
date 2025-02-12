import User from '#models/user'
import { defineConfig } from '@adonisjs/auth'
import { sessionGuard, sessionUserProvider } from '@adonisjs/auth/session'
import type { InferAuthEvents, Authenticators } from '@adonisjs/auth/types'
import { jwtGuard } from '@maximemrf/adonisjs-jwt/jwt_config'
import { BaseJwtContent, JwtGuardUser } from '@maximemrf/adonisjs-jwt/types'
import app from './app.js'

interface JwtContent extends BaseJwtContent {
    userId: string | number | BigInt,
    roleId: number
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
            tokenExpiresIn: `${app.tokenExpiration}h`,
            useCookies: false,
            provider: sessionUserProvider({
                model: () => import('#models/user'),
            }),
            content: (user: JwtGuardUser<User>): JwtContent => ({
                userId: user.getId(),
                roleId: user.getOriginal().userRole.roleId
            }),
        })
    },
})

export default authConfig

// Inferring types from the configured auth guards.
declare module '@adonisjs/auth/types' {
    export interface Authenticators extends InferAuthenticators<typeof authConfig> { }
}

declare module '@adonisjs/core/types' {
    interface EventsList extends InferAuthEvents<Authenticators> { }
}
