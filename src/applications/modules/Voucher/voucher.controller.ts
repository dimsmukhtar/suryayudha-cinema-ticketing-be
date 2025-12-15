import { Request, Response, NextFunction, Router } from 'express'
import { VoucherService } from './voucher.service'
import { UpdateVoucherPayload, VoucherPayload } from '@infrastructure/types/entities/VoucherTypes'
import { authenticate } from '@shared/middlewares/authenticate'
import { validateAdmin } from '@shared/middlewares/valiadateAdmin'
import { BadRequestException } from '@shared/error-handling/exceptions/bad-request.exception'

export class VoucherController {
  private readonly voucherRouter: Router
  constructor(private readonly service: VoucherService) {
    this.voucherRouter = Router()
    this.initializeVoucherRoutes()
  }

  private initializeVoucherRoutes(): void {
    this.voucherRouter.post('/', authenticate, validateAdmin, this.createVoucher)
    this.voucherRouter.get('/', authenticate, validateAdmin, this.getAllVouchers)
    this.voucherRouter.patch('/:transactionId/apply', this.applyVoucherToTransaction)
    this.voucherRouter.get('/:id', authenticate, validateAdmin, this.getVoucherById)
    this.voucherRouter.patch('/:id', authenticate, validateAdmin, this.updateVoucher)
    this.voucherRouter.delete('/:id', authenticate, validateAdmin, this.deleteVoucher)
  }

  private createVoucher = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const voucherCreatePayloadRequest: VoucherPayload = {
        ...req.body,
        usage_count: 0,
        value: parseInt(req.body.value),
        min_purchase_amount: parseInt(req.body.min_purchase_amount),
        usage_limit: parseInt(req.body.usage_limit)
      }
      const voucher = await this.service.createVoucher(voucherCreatePayloadRequest)
      res.status(201).json({ success: true, message: 'Voucher berhasil dibuat', data: voucher })
    } catch (e) {
      next(e)
    }
  }

  private getAllVouchers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vouchers = await this.service.getAllVouchers()
      res
        .status(200)
        .json({ success: true, message: 'Semua voucher berhasil diambil', data: vouchers })
    } catch (e) {
      next(e)
    }
  }

  private getVoucherById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const voucher = await this.service.getVoucherById(parseInt(req.params.id))
      res.status(200).json({ success: true, message: 'Voucher berhasil diambil', data: voucher })
    } catch (e) {
      next(e)
    }
  }

  private updateVoucher = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updateVoucherPayloadRequest: UpdateVoucherPayload = {
        ...req.body,
        ...(req.body.value && { value: parseInt(req.body.value) }),
        ...(req.body.min_purchase_amount && {
          min_purchase_amount: parseInt(req.body.min_purchase_amount)
        }),
        ...(req.body.usage_limit && { usage_limit: parseInt(req.body.usage_limit) })
      }
      const voucher = await this.service.updateVoucher(
        parseInt(req.params.id),
        updateVoucherPayloadRequest
      )
      res.status(200).json({ success: true, message: 'Voucher berhasil diupdate', data: voucher })
    } catch (e) {
      next(e)
    }
  }

  private deleteVoucher = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.deleteVoucher(parseInt(req.params.id))
      res.status(200).json({ success: true, message: 'Voucher berhasil dihapus' })
    } catch (e) {
      next(e)
    }
  }

  private applyVoucherToTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transactionId = parseInt(req.params.transactionId)
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

  public getRoutes(): Router {
    return this.voucherRouter
  }
}
