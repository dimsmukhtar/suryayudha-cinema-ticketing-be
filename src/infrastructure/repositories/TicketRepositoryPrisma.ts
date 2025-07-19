import { PrismaClient, Ticket, TicketStatus, TransactionStatus } from '@prisma/client'
import { NotFoundException } from '../../shared/error-handling/exceptions/not-found.exception'
import { checkExists } from '../../shared/helpers/checkExistingRow'

export class TicketRepositoryPrisma {
  constructor(private readonly prisma: PrismaClient) {}

  async getAllTickets(): Promise<Ticket[]> {
    return await this.prisma.ticket.findMany()
  }

  async getTicketById(ticketId: number): Promise<any> {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        transaction_item: {
          include: {
            schedule_seat: {
              include: {
                schedule: {
                  include: {
                    movie: {
                      select: {
                        title: true
                      }
                    },
                    studio: {
                      select: {
                        name: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    })
    if (!ticket) {
      throw new NotFoundException(`Tiket dengan id ${ticketId} tidak ditemukan`)
    }

    const customedTicket = {
      id: ticket.id,
      movie_title: ticket.transaction_item.schedule_seat.schedule.movie.title,
      studio: ticket.transaction_item.schedule_seat.schedule.studio.name,
      start_time: ticket.transaction_item.schedule_seat.schedule.start_time,
      finished_time: ticket.transaction_item.schedule_seat.schedule.finished_time,
      seat_label: ticket.transaction_item.seat_label,
      code: ticket.code,
      status: ticket.status
    }
    return customedTicket
  }
  async getTicketByCode(code: string): Promise<any> {
    const ticket = await this.prisma.ticket.findUnique({
      where: { code: code },
      include: {
        transaction_item: {
          include: {
            schedule_seat: {
              include: {
                schedule: {
                  include: {
                    movie: {
                      select: {
                        title: true
                      }
                    },
                    studio: {
                      select: {
                        name: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    })
    if (!ticket) {
      throw new NotFoundException(`Tiket dengan kode ${code} tidak ditemukan`)
    }

    const customedTicket = {
      id: ticket.id,
      movie_title: ticket.transaction_item.schedule_seat.schedule.movie.title,
      studio: ticket.transaction_item.schedule_seat.schedule.studio.name,
      start_time: ticket.transaction_item.schedule_seat.schedule.start_time,
      finished_time: ticket.transaction_item.schedule_seat.schedule.finished_time,
      seat_label: ticket.transaction_item.seat_label,
      code: ticket.code,
      status: ticket.status
    }
    return customedTicket
  }

  async deleteTicket(ticketId: number): Promise<void> {
    await checkExists(this.prisma.ticket, ticketId, 'Tiket')
    await this.prisma.ticket.delete({ where: { id: ticketId } })
  }

  async getMyTickets(userId: number): Promise<any> {
    const allMyTickets = this.prisma.ticket.findMany({
      where: {
        transaction_item: {
          transaction: {
            user_id: userId
          }
        }
      },
      include: {
        transaction_item: {
          include: {
            schedule_seat: {
              include: {
                schedule: {
                  include: {
                    movie: {
                      select: {
                        title: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    })

    const customedTickets = (await allMyTickets).map((ticket) => ({
      id: ticket.id,
      movie_title: ticket.transaction_item.schedule_seat.schedule.movie.title,
      seat_label: ticket.transaction_item.seat_label
    }))
    return customedTickets
  }

  async validateTicket(code: string): Promise<Ticket> {
    const ticket = await this.prisma.ticket.findUnique({
      where: {
        code
      },
      include: {
        transaction_item: {
          include: {
            schedule_seat: {
              include: {
                schedule: true
              }
            }
          }
        }
      }
    })

    if (!ticket) {
      throw new NotFoundException(`Tiket dengan kode ${code} tidak ditemukan`)
    }

    if (ticket.status === TicketStatus.used) {
      throw new NotFoundException(`Tiket dengan kode ${code} sudah pernah digunakan`)
    }

    if (ticket.transaction_item.schedule_seat.schedule.finished_time < new Date()) {
      throw new NotFoundException(
        `Tiket dengan kode ${code} sudah kadaluarsa karena jadwal film telah berakhir.`
      )
    }

    const validatedTicket = await this.prisma.ticket.update({
      where: {
        id: ticket.id
      },
      data: {
        status: TicketStatus.used
      }
    })

    return validatedTicket
  }
}
