export class HttpException extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly message: string
  ) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
    Error.captureStackTrace(this, this.constructor)
  }

  serialize() {
    return {
      success: false,
      statusCode: this.statusCode,
      message: this.message,
      timeStamp: new Date().toISOString()
    }
  }
}
