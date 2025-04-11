import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { Secret } from '@adonisjs/core/helpers'
import { defineConfig } from '@adonisjs/core/http'

/**
 * The app key is used for encrypting cookies, generating signed URLs,
 * and by the "encryption" module.
 *
 * The encryption module will fail to decrypt data if the key is lost or
 * changed. Therefore it is recommended to keep the app key secure.
 */
export const appKey = new Secret(env.get('APP_KEY'))

/**
 * The configuration settings used by the HTTP server
 */
export const http = defineConfig({
    generateRequestId: true,
    allowMethodSpoofing: false,

    /**
     * Enabling async local storage will let you access HTTP context
     * from anywhere inside your application.
     */
    useAsyncLocalStorage: false,

    /**
     * Manage cookies configuration. The settings for the session id cookie are
     * defined inside the "config/session.ts" file.
     */
    cookie: {
        domain: '',
        path: '/',
        maxAge: '2h',
        httpOnly: true,
        secure: app.inProduction,
        sameSite: 'lax',
    },
})

export default {
    appKey,
    http,

    tokenExpiration: 10,

    defaultPage: 1,
    defaultPerPage: 10,

    defaultView: 'viewed',
    defaultCreate: 'created',
    defaultUpdate: 'updated',
    defaultDelete: 'deleted',
    defaultExport: 'export',
    defaultApprove: 'approve',
}
