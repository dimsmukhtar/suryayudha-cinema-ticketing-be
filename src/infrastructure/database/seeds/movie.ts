import { MovieStatus, PrismaClient } from '@prisma/client'
import data from './data/movies.json'
import { logger } from '@/shared/logger/logger'

export const tableName = 'Movies'

export default async function seed(prisma: PrismaClient) {
  for (const movie of data) {
    const genreRecords = []
    for (const genreName of movie.genres) {
      const g = await prisma.genre.upsert({
        where: { name: genreName },
        update: {},
        create: { name: genreName }
      })
      genreRecords.push(g)
    }

    await prisma.movie.create({
      data: {
        title: movie.title,
        synopsis: movie.synopsis,
        director: movie.director,
        duration: movie.duration,
        rating: movie.rating,
        language: movie.language,
        subtitle: movie.subtitle,
        poster_url: movie.poster_url,
        trailer_url: movie.trailer_url,
        release_date: movie.release_date,
        status: movie.status as MovieStatus,
        created_by_id: 1,
        movie_genres: {
          create: genreRecords.map((g) => ({
            genre: {
              connect: {
                id: g.id
              }
            }
          }))
        }
      }
    })

    logger.info({
      from: 'seed:movie',
      message: `${movie.title} movie seeded successfully ✅`
    })
  }
}
