export default interface CustomError extends Error {
  statusCode: number
  message: string
}
