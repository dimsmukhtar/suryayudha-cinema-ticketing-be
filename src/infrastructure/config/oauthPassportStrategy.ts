import passport from 'passport'
import PassportGoogle from 'passport-google-oauth20'
import PassportFacebook from 'passport-facebook'

import { prisma } from './clientPrisma'
import { UserJwtPayload } from 'infrastructure/types/entities/UserTypes'

const GoogleStrategy = PassportGoogle.Strategy
const FacebookStrategy = PassportFacebook.Strategy

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: 'http://localhost:3000/api/v1/auth/google/callback',
      passReqToCallback: false
    },
    async function (accessToken, refreshToken, profile: any, done) {
      try {
        const providerId = profile.id
        const provider = 'google'
        const name = profile.displayName ?? 'unknown'
        const email = profile.emails?.[0]?.value ?? 'unknown'
        const profile_url = profile.photos?.[0]?.value ?? null
        let userDb = await prisma.user.findFirst({
          where: {
            provider: 'google',
            providerId
          }
        })
        if (!userDb) {
          userDb = await prisma.user.create({
            data: {
              providerId,
              provider,
              name,
              email,
              profile_url,
              password: 'not needed'
            }
          })
        }
        const user: UserJwtPayload = {
          id: userDb.id,
          name: userDb.name,
          email: userDb.email,
          role: userDb.role,
          iat: Math.floor(Date.now() / 1000).toString(),
          exp: String(Math.floor(Date.now() / 1000) + 3600)
        }
        return done(null, user)
      } catch (error) {
        return done(error, false)
      }
    }
  )
)

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      callbackURL: 'http://localhost:3000/api/v1/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'name', 'emails', 'photos'],
      passReqToCallback: false
    },
    async (accessToken, refreshToken, profile: any, done) => {
      try {
        const providerId = profile.id
        const provider = 'facebook'
        const name = profile.displayName ?? 'unknown'
        const email = profile.emails?.[0]?.value ?? 'unknown'
        const profile_url = profile.photos?.[0]?.value ?? null
        let user = await prisma.user.findFirst({
          where: {
            provider: 'facebook',
            providerId
          }
        })
        if (!user) {
          user = await prisma.user.create({
            data: {
              providerId,
              provider,
              name,
              email,
              profile_url,
              password: 'not needed'
            }
          })
        }
        return done(null, user)
      } catch (error) {
        return done(error, false)
      }
    }
  )
)

export default passport
