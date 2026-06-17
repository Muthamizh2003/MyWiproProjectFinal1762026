export const API_BASE = '/api'

export const ERROR_MESSAGES = {
  NETWORK: 'Unable to connect. Please check your internet connection.',
  UNAUTHORIZED: 'Session expired. Please log in again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER: 'Something went wrong. Please try again later.',
  DEFAULT: 'An unexpected error occurred.'
}

export const STATUS_COLORS = {
  PENDING: 'bg-warning',
  CONFIRMED: 'bg-info',
  PREPARING: 'bg-primary',
  OUT_FOR_DELIVERY: 'bg-secondary',
  DELIVERED: 'bg-success',
  CANCELLED: 'bg-danger'
}

export const ROLES = {
  USER: 'ROLE_USER',
  ADMIN: 'ROLE_ADMIN'
}

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PREPARING: 'PREPARING',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
}

export const PIZZA_SIZES = ['Small', 'Medium', 'Large', 'Extra Large']
