
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  name: 'name',
  role: 'role',
  email: 'email',
  password: 'password',
  is_verified: 'is_verified',
  verification_token: 'verification_token',
  verification_token_expires_at: 'verification_token_expires_at',
  reset_password_token: 'reset_password_token',
  reset_password_token_expires_at: 'reset_password_token_expires_at',
  profile_url: 'profile_url',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.MovieScalarFieldEnum = {
  id: 'id',
  title: 'title',
  synopsis: 'synopsis',
  director: 'director',
  duration: 'duration',
  rating: 'rating',
  language: 'language',
  subtitle: 'subtitle',
  poster_url: 'poster_url',
  trailer_url: 'trailer_url',
  release_date: 'release_date',
  status: 'status',
  created_by_id: 'created_by_id',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.MovieCastScalarFieldEnum = {
  id: 'id',
  actor_name: 'actor_name',
  actor_url: 'actor_url',
  movie_id: 'movie_id',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.GenreScalarFieldEnum = {
  id: 'id',
  name: 'name',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.MovieGenreScalarFieldEnum = {
  id: 'id',
  movie_id: 'movie_id',
  genre_id: 'genre_id',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  isRead: 'isRead',
  user_id: 'user_id',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.StudioScalarFieldEnum = {
  id: 'id',
  name: 'name',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.StudioGalleryScalarFieldEnum = {
  id: 'id',
  photo_url: 'photo_url',
  studio_id: 'studio_id',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.SeatScalarFieldEnum = {
  id: 'id',
  seat_label: 'seat_label',
  studio_id: 'studio_id',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.ScheduleScalarFieldEnum = {
  id: 'id',
  date: 'date',
  start_time: 'start_time',
  finished_time: 'finished_time',
  price: 'price',
  created_by_id: 'created_by_id',
  movie_id: 'movie_id',
  studio_id: 'studio_id',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.ScheduleSeatScalarFieldEnum = {
  id: 'id',
  status: 'status',
  schedule_id: 'schedule_id',
  seat_id: 'seat_id',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.VoucherScalarFieldEnum = {
  id: 'id',
  code: 'code',
  type: 'type',
  value: 'value',
  expires_at: 'expires_at',
  usage_limit: 'usage_limit',
  usage_count: 'usage_count',
  min_purchase_amount: 'min_purchase_amount',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.TransactionScalarFieldEnum = {
  id: 'id',
  total_amount: 'total_amount',
  discount_amount: 'discount_amount',
  final_amount: 'final_amount',
  payment_type: 'payment_type',
  payment_status: 'payment_status',
  booking_status: 'booking_status',
  transaction_time: 'transaction_time',
  booking_expires_at: 'booking_expires_at',
  user_id: 'user_id',
  voucher_id: 'voucher_id',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.TransactionItemScalarFieldEnum = {
  id: 'id',
  transaction_id: 'transaction_id',
  schedule_seat_id: 'schedule_seat_id',
  price: 'price',
  seat_label: 'seat_label',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.TicketScalarFieldEnum = {
  id: 'id',
  code: 'code',
  status: 'status',
  transaction_item_id: 'transaction_item_id',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.Role = exports.$Enums.Role = {
  user: 'user',
  admin: 'admin'
};

exports.MovieStatus = exports.$Enums.MovieStatus = {
  coming_soon: 'coming_soon',
  now_showing: 'now_showing',
  ended: 'ended'
};

exports.SeatStatus = exports.$Enums.SeatStatus = {
  available: 'available',
  booked: 'booked',
  reserved: 'reserved'
};

exports.VoucherType = exports.$Enums.VoucherType = {
  percentage: 'percentage',
  fixed: 'fixed'
};

exports.BookingStatus = exports.$Enums.BookingStatus = {
  initiated: 'initiated',
  pending: 'pending',
  cancelled: 'cancelled',
  settlement: 'settlement'
};

exports.TicketStatus = exports.$Enums.TicketStatus = {
  active: 'active',
  used: 'used',
  expired: 'expired',
  cancelled: 'cancelled'
};

exports.Prisma.ModelName = {
  User: 'User',
  Movie: 'Movie',
  MovieCast: 'MovieCast',
  Genre: 'Genre',
  MovieGenre: 'MovieGenre',
  Notification: 'Notification',
  Studio: 'Studio',
  StudioGallery: 'StudioGallery',
  Seat: 'Seat',
  Schedule: 'Schedule',
  ScheduleSeat: 'ScheduleSeat',
  Voucher: 'Voucher',
  Transaction: 'Transaction',
  TransactionItem: 'TransactionItem',
  Ticket: 'Ticket'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
