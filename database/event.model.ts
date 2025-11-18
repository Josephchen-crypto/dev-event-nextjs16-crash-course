import mongoose, { Schema, Document } from 'mongoose'

export interface IEvent extends Document {
  title: string
  slug: string
  description: string
  overview: string
  image: string
  venue: string
  location: string
  date: string
  time: string
  mode: 'online' | 'offline' | 'hybrid'
  audience: string
  agenda: string[]
  organizer: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

const EventSchema = new Schema<IEvent>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  overview: {
    type: String,
    required: [true, 'Overview is required'],
    trim: true,
    maxlength: [500, 'Overview cannot exceed 500 characters']
  },
  image: {
    type: String,
    required: [true, 'Image is required']
  },
  venue: {
    type: String,
    required: [true, 'Venue is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  date: {
    type: String,
    required: [true, 'Date is required']
  },
  time: {
    type: String,
    required: [true, 'Time is required']
  },
  mode: {
    type: String,
    enum: ['online', 'offline', 'hybrid'],
    required: [true, 'Mode is required']
  },
  audience: {
    type: String,
    required: [true, 'Audience is required'],
    trim: true
  },
  agenda: {
    type: [String],
    required: [true, 'Agenda is required'],
    validate: {
      validator: function(v: string[]) {
        return v.length > 0
      },
      message: 'Agenda must have at least one item'
    }
  },
  organizer: {
    type: String,
    required: [true, 'Organizer is required'],
    trim: true
  },
  tags: {
    type: [String],
    required: [true, 'Tags are required'],
    validate: {
      validator: function(v: string[]) {
        return v.length > 0
      },
      message: 'There must be at least one tag'
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

EventSchema.pre('save', function(next) {
  // Auto-generate slug from title if it's new or title has changed
  if (this.isModified('title') || this.isNew) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^--|-$/g, '')
      .trim()
  }

  // Validate and normalize date to ISO format
  if (this.isModified('date')) {
    const parsedDate = new Date(this.date)
    if (isNaN(parsedDate.getTime())) {
      return next(new Error('Invalid date format'))
    }
    this.date = parsedDate.toISOString().split('T')[0] // YYYY-MM-DD format
  }

  // Ensure time format consistency (HH:MM)
  if (this.isModified('time')) {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    if (!timeRegex.test(this.time)) {
      return next(new Error('Time must be in HH:MM format'))
    }
  }

  // Validate required fields
  const requiredFields = ['title', 'description', 'overview', 'image', 'venue', 'location', 'date', 'time', 'mode', 'audience', 'organizer']
  for (const field of requiredFields) {
    if (!this.get(field)) {
      return next(new Error(`${field} is required`))
    }
  }

  next()
})

EventSchema.index({ slug: 1 })

export const Event = mongoose.model<IEvent>('Event', EventSchema)