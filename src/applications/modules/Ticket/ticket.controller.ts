import { Request, Response, NextFunction, Router } from 'express'
import { TicketService } from './ticket.service'
import { authenticate } from '../../../shared/middlewares/authenticate'
import { validateAdmin } from '../../../shared/middlewares/valiadateAdmin'
import { string } from 'zod'

export class TicketController {
  private readonly ticketRouter: Router
  constructor(private readonly service: TicketService) {
    this.ticketRouter = Router()
    this.initializeTicketRoutes()
  }

  private initializeTicketRoutes(): void {
    this.ticketRouter.get('/', authenticate, validateAdmin, this.getAllTickets)
    this.ticketRouter.get('/my', authenticate, this.getMyTickets)
    this.ticketRouter.patch('/validate', authenticate, validateAdmin, this.validateTicket)
    this.ticketRouter.get('/:code/find-code', authenticate, validateAdmin, this.getTicketByCode)
    this.ticketRouter.get('/:id', authenticate, this.getTicketById)
    this.ticketRouter.delete('/:id', authenticate, validateAdmin, this.deleteTicket)
  }

  private getAllTickets = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 10
      const code = req.query.code as string | undefined

      const { tickets, total } = await this.service.getAllTickets(page, limit, code)

      res.status(200).json({
        success: true,
        message: 'Semua tiket berhasil diambil',
        data: tickets,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      })
    } catch (e) {
      next(e)
    }
  }

  private getTicketById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ticket = await this.service.getTicketById(parseInt(req.params.id))
      res
        .status(200)
        .json({ success: true, message: 'Detail tiket berhasil diambil', data: ticket })
    } catch (e) {
      next(e)
    }
  }
  private getTicketByCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ticketCode = req.params.code
      const ticket = await this.service.getTicketByCode(ticketCode)
      res
        .status(200)
        .json({ success: true, message: 'Detail tiket berhasil diambil', data: ticket })
    } catch (e) {
      next(e)
    }
  }

  private deleteTicket = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.deleteTicket(parseInt(req.params.id))
      res.status(200).json({ success: true, message: 'Tiket berhasil dihapus' })
    } catch (e) {
      next(e)
    }
  }

  private getMyTickets = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tickets = await this.service.getMyTickets(req.user!.id)
      res
        .status(200)
        .json({ success: true, message: 'Semua tiket saya berhasil diambil', data: tickets })
    } catch (e) {
      next(e)
    }
  }

  private validateTicket = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ticketCode = req.body.code
      const ticket = await this.service.validateTicket(ticketCode)
      res
        .status(200)
        .json({ success: true, message: 'Tiket valid dan telah berhasil divalidasi', data: ticket })
    } catch (e) {
      next(e)
    }
  }

  public getRoutes(): Router {
    return this.ticketRouter
  }
}
