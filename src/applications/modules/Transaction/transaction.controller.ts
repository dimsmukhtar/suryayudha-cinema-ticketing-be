import { Request, Response, NextFunction, Router } from 'express'
import { TransactionService } from './transaction.service'
import { authenticate } from '../../../shared/middlewares/authenticate'
import { BadRequestException } from '../../../shared/error-handling/exceptions/bad-request.exception'

export class TransactionController {
  private readonly transactionRouter: Router
  constructor(private readonly service: TransactionService) {
    this.transactionRouter = Router()
    this.initializeTransactionRoutes()
  }

  private initializeTransactionRoutes(): void {
    this.transactionRouter.post('/', authenticate, this.createBooking)
    this.transactionRouter.get('/', this.getAllTransactions)
    this.transactionRouter.get('/my', authenticate, this.getMyTransactions)
    this.transactionRouter.get('/user/:id', this.getTransactionsByUserId)
    this.transactionRouter.patch('/:id/apply-voucher', this.applyVoucherToTransaction)
    this.transactionRouter.post('/:id/pay', authenticate, this.initiatePayment)
    this.transactionRouter.get('/:id', this.getTransactionById)
  }

  private createBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scheduleId = parseInt(req.body.schedule_id)
      const userId = req.user!.id
      if (!req.body.schedule_seat_ids) {
        throw new BadRequestException('Schedule seat ids tidak boleh kosong')
      }
      const scheduleSeatIds = req.body.schedule_seat_ids
        .split(',')
        .map((id: string) => parseInt(id.trim()))
        .filter((id: number) => !isNaN(id))

      const transaction = await this.service.createBooking(scheduleId, userId, scheduleSeatIds)

      res.status(201).json({ success: true, message: 'Booking berhasil dibuat', data: transaction })
    } catch (e) {
      next(e)
    }
  }

  private getAllTransactions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transactions = await this.service.getAllTransactions()
      res
        .status(200)
        .json({ success: true, message: 'Semua transaksi berhasil diambil', data: transactions })
    } catch (e) {
      next(e)
    }
  }

  private getTransactionById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transaction = await this.service.getTransactionById(parseInt(req.params.id))
      res
        .status(200)
        .json({ success: true, message: 'Transaksi berhasil diambil', data: transaction })
    } catch (e) {
      next(e)
    }
  }

  private getTransactionsByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = parseInt(req.params.id)
      const transactions = await this.service.getTransactionsByUserId(userId)
      res
        .status(200)
        .json({ success: true, message: 'Semua transaksi berhasil diambil', data: transactions })
    } catch (e) {
      next(e)
    }
  }

  private getMyTransactions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id
      const transactions = await this.service.getTransactionsByUserId(userId)
      res
        .status(200)
        .json({ success: true, message: 'Semua transaksi berhasil diambil', data: transactions })
    } catch (e) {
      next(e)
    }
  }

  private applyVoucherToTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transactionId = parseInt(req.params.id)
      if (!req.body.voucher_code) {
        throw new BadRequestException('Voucher code tidak boleh kosong')
      }
      const voucherCode = req.body.voucher_code
      const uppercaseVoucherCode = voucherCode.toUpperCase()

      const transaction = await this.service.applyVoucherToTransaction(
        transactionId,
        uppercaseVoucherCode
      )
      res
        .status(200)
        .json({ success: true, message: 'Voucher berhasil diterapkan', data: transaction })
    } catch (e) {
      next(e)
    }
  }

  private initiatePayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transactionId = parseInt(req.params.id)
      const userId = req.user!.id
      const { snapToken, paymentUrl } = await this.service.initiatePayment(transactionId, userId)

      res.status(200).json({
        success: true,
        message: 'Midtrans token dan payment url berhasil dikirim',
        data: {
          snapToken,
          paymentUrl
        }
      })
    } catch (e) {
      next(e)
    }
  }

  public getRoutes(): Router {
    return this.transactionRouter
  }
}
