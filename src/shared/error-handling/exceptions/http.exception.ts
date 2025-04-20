export class HttpException extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly message: string,
    public readonly errorCode?: string
  ) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
    Error.captureStackTrace(this, this.constructor)
  }

  serialize() {
    return {
      success: false,
      statusCode: this.statusCode,
      errorCode: this.errorCode || 'ERROR_CODE_NOT_FOUND',
      message: this.message,
      timeStamp: new Date().toISOString()
    }
  }
}
