import { committees } from '@/data/committees'
import { type ClassValue, clsx } from 'clsx'
import { Timestamp } from 'firebase/firestore'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const convertToDate = (
  date: Timestamp | Date | { seconds: number; nanoseconds: number }
) => {
  if (date instanceof Timestamp) {
    return date.toDate()
  }
  if (date instanceof Date) {
    return date
  }
  return new Date(date.seconds * 1000)
}

export const formatDate = (date: Timestamp | Date | { seconds: number; nanoseconds: number }) => {
  const convertedToDate = convertToDate(date)

  return convertedToDate.toLocaleString('sv-SE', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const getCommittee = (committeeId: string) => {
  return committees.find((committee) => committee.id === committeeId) || null
}
