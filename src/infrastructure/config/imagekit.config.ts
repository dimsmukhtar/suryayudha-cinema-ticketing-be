import ImageKit from 'imagekit'
import { HttpException } from '@shared/error-handling/exceptions/http.exception'

export const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!
})

export const uploadImageToImageKit = async (
  fileName: string,
  folderName: string,
  file: Express.Multer.File
): Promise<{ url: string; fileId: string }> => {
  try {
    const response = await imageKit.upload({
      file: file.buffer,
      fileName: `${fileName}_${Date.now()}`,
      folder: folderName,
      useUniqueFileName: true
    })
    return {
      url: response.url,
      fileId: response.fileId
    }
  } catch (error) {
    throw new HttpException(500, 'Gagal mengupload ke image kit')
  }
}

export const deleteImageFromImageKit = async (fileId: string): Promise<void> => {
  try {
    await imageKit.deleteFile(fileId)
  } catch (error) {
    throw new HttpException(500, 'Gagal hapus dari image kit')
  }
}
