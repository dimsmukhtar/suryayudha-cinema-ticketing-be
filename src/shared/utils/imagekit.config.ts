import ImageKit from 'imagekit'
import { HttpException } from '../error-handling/exceptions/http.exception'

export const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!
})

export const uploadImageToImageKit = async (
  fileName: string,
  folderName: string,
  file: Express.Multer.File
): Promise<string> => {
  try {
    const response = await imageKit.upload({
      file: file.buffer,
      fileName: `${fileName}_${Date.now()}`,
      folder: folderName,
      useUniqueFileName: true
    })
    return response.url
  } catch (error) {
    throw new HttpException(500, 'Gagal mengupload ke image kit')
  }
}
