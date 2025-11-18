import mongoose, { Schema, Document, models } from 'mongoose'
import { Event } from './event.model'

export interface IBooking extends Document {
  eventId: mongoose.Types.ObjectId
  email: string
  createdAt: Date
  updatedAt: Date
}

const BookingSchema = new Schema<IBooking>({
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event ID is required'],
    index: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    validate: {
      validator: function(email: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
      },
      message: 'Invalid email format'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

BookingSchema.pre('save', async function(next) {
  // Validate that referenced event exists
  if (this.isNew || this.isModified('eventId')) {
    try {
      const eventExists = await Event.exists({ _id: this.eventId })
      if (!eventExists) {
        return next(new Error('Referenced event does not exist'))
      }
    } catch {
      const validationError = new Error('Invalid event ID format or database error')
      validationError.name = 'ValidationError'
      return next(validationError)
    }
  }

  // Validate email format
  if (!this.email) {
    return next(new Error('Email is required'))
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(this.email)) {
    return next(new Error('Invalid email format'))
  }

  next()
})

// Create index on eventId for faster queries
BookingSchema.index({ eventId: 1 })

// Create compound index for common queries (event bookings by date)
BookingSchema.index({ eventId: 1, createdAt: -1 })

// Create index on email for user booking lookups
BookingSchema.index({ email: 1 })

export const Booking = models.Booking || mongoose.model<IBooking>('Booking', BookingSchema)