import multer from 'multer'
import { Request } from 'express'

const storage = multer.memoryStorage()

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Invalid tipe file, hanya JPEG, PNG, JPG, dan WEBP yang di perbolehkan'))
  }
  cb(null, true)
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
})
