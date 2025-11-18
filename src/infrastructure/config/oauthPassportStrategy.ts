import passport from 'passport'
import PassportGoogle from 'passport-google-oauth20'
import PassportFacebook from 'passport-facebook'

import { findOrCreateUser } from '@shared/helpers/authLogic'
import { buildJwtPayload } from '@shared/helpers/builtJwtPayload'

const GoogleStrategy = PassportGoogle.Strategy
const FacebookStrategy = PassportFacebook.Strategy

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: false
    },
    async function (accessToken, refreshToken, profile: any, done) {
      try {
        const userDb = await findOrCreateUser('google', profile)
        const userJwt = buildJwtPayload(userDb)
        return done(null, userJwt)
      } catch (e) {
        console.error('❌ Error in GoogleStrategy:', e)
        return done(e, false)
      }
    }
  )
)

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL!,
      profileFields: ['id', 'displayName', 'name', 'emails', 'photos'],
      passReqToCallback: false
    },
    async (accessToken, refreshToken, profile: any, done) => {
      try {
        const userDb = await findOrCreateUser('facebook', profile)
        const userJwt = buildJwtPayload(userDb)
        return done(null, userJwt)
      } catch (e) {
        console.error('❌ Error in FacebookStrategy:', e)
        return done(e, false)
      }
    }
  )
)

export default passport
