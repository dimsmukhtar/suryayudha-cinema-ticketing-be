import ImageKit from 'imagekit'

export const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!
})

export const uploadImageToImageKit = async (file: Express.Multer.File): Promise<string> => {
  try {
    const response = await imageKit.upload({
      file: file.buffer,
      fileName: `poster_${Date.now()}`,
      folder: '/movie-posters',
      useUniqueFileName: true
    })
    return response.url
  } catch (error) {
    throw new Error('Failed to upload image')
  }
}

export const deleteImageFromImageKit = async (url: string): Promise<void> => {
  try {
    const fileId = url.split('/').pop()?.split('.')[0] || ''
    await imageKit.deleteFile(fileId)
  } catch (error) {
    console.error('Failed to delete image from ImageKit', error)
  }
}
