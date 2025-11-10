import { prisma } from '../../infrastructure/config/clientPrisma'

export async function findOrCreateUser(provider: 'google' | 'facebook', profile: any) {
  const providerId = profile.id
  const name = profile.displayName ?? 'unknown'
  const email = profile.emails?.[0]?.value ?? 'unknown'
  const profile_url = profile.photos?.[0]?.value ?? null

  let user = await prisma.user.findFirst({
    where: {
      email
    }
  })
  if (!user) {
    user = await prisma.user.create({
      data: {
        providerId,
        provider,
        name,
        is_verified: true,
        email,
        profile_url,
        password: 'not needed'
      }
    })
  } else {
    if (!user.providerId) {
      user = await prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          provider,
          providerId
        }
      })
    }
  }
  return user
}
