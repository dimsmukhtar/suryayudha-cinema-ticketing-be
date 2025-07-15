import { Movie, MovieStatus, Prisma, PrismaClient } from '@prisma/client'
import { ConflictException } from '../../shared/error-handling/exceptions/conflict.exception'
import { MoviePayload, MoviePayloadUpdate, MovieQuery } from '../types/entities/MovieTypes'
import { IMovieRepository } from '../types/entities/MovieTypes'
import { NotFoundException } from '../../shared/error-handling/exceptions/not-found.exception'
import { checkExists } from '../../shared/helpers/checkExistingRow'
import { uploadImageToImageKit } from '../../shared/utils/imagekit.config'

export class MovieRepositoryPrisma implements IMovieRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createMovie(movieData: MoviePayload, userId: number, genreIds: number[]): Promise<Movie> {
    const { url: posterUrl } = await uploadImageToImageKit(
      'poster',
      '/posters',
      movieData.poster_url
    )
    const movieDataWithPosterUrl = { ...movieData, poster_url: posterUrl }
    return await this.prisma.$transaction(async (tx) => {
      const existingMovie = await tx.movie.findFirst({
        where: {
          title: movieData.title
        }
      })

      if (existingMovie)
        throw new ConflictException(`Film dengan judul ${movieData.title} sudah ada`)

      const arrayGenreIds: number[] = Array.isArray(genreIds) ? genreIds : []
      if (arrayGenreIds.length) {
        const count = await tx.genre.count({ where: { id: { in: arrayGenreIds } } })
        if (count !== arrayGenreIds.length) {
          throw new NotFoundException('Beberapa genre tidak ditemukan')
        }
      }
      const movie = await tx.movie.create({
        data: {
          ...movieDataWithPosterUrl,
          release_date: new Date(movieData.release_date),
          created_by_id: userId,
          movie_genres: {
            create: arrayGenreIds.map((gid) => ({
              genre: { connect: { id: gid } }
            }))
          }
        },
        include: {
          movie_genres: { include: { genre: true } }
        }
      })

      return movie
    })
  }

  async getAllMovies(query: MovieQuery): Promise<Movie[]> {
    const where: Prisma.MovieWhereInput = {}
    if (query.title) {
      where.title = {
        contains: query.title,
        mode: 'insensitive'
      }
    }

    if (query.status) {
      where.status = query.status as MovieStatus
    }

    if (query.genre) {
      const genreNames = query.genre.split(',').map((g) => g.trim())
      where.movie_genres = {
        some: {
          genre: {
            name: {
              in: genreNames,
              mode: 'insensitive'
            }
          }
        }
      }
    }
    return await this.prisma.movie.findMany({
      where,
      include: {
        movie_genres: {
          include: {
            genre: true
          }
        }
      },
      orderBy: {
        release_date: 'desc'
      }
    })
  }

  async getMovieById(movieId: number) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
      include: {
        created_by: {
          select: {
            id: true,
            name: true
          }
        },
        casts: {
          select: {
            id: true,
            actor_name: true,
            actor_url: true
          }
        },
        movie_genres: {
          select: {
            id: true,
            genre: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        schedules: true
      }
    })

    if (!movie) {
      throw new NotFoundException(`Film dengan id ${movieId} tidak ditemukan`)
    }
    const movie_genres = movie.movie_genres.map((mg) => mg.genre)
    const movieData = {
      ...movie,
      movie_genres
    }
    return movieData
  }

  async updateMovie(movieId: number, movieData: MoviePayloadUpdate): Promise<Movie> {
    await checkExists(this.prisma.movie, movieId, 'Film')
    let posterUrl: string | undefined
    if (movieData.poster_url) {
      const { url } = await uploadImageToImageKit('poster', '/posters', movieData.poster_url)
      posterUrl = url
    }
    const data: any = {
      ...movieData,
      ...(posterUrl && { poster_url: posterUrl }),
      ...(movieData.release_date && {
        release_date: new Date(movieData.release_date)
      })
    }
    return await this.prisma.movie.update({
      where: {
        id: movieId
      },
      data: data
    })
  }

  async deleteMovie(movieId: number): Promise<void> {
    await checkExists(this.prisma.movie, movieId, 'Film')
    await this.prisma.movie.delete({
      where: { id: movieId }
    })
  }
}
