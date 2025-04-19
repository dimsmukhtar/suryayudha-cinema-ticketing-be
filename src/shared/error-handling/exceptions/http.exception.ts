export class HttpException extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly message: string
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }

  toJSON() {
    return {
      success: false,
      statusCode: this.statusCode,
      message: this.message,
      timeStamp: new Date().toISOString()
    }
  }
}
