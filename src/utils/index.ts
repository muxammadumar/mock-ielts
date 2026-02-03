// Utility functions

export const formatDate = (date: Date | string | number, format = 'YYYY-MM-DD'): string => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')

  return format.replace('YYYY', String(year)).replace('MM', month).replace('DD', day)
}

export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Formats phone number to Uzbek format: +998 XX XXX XX XX
 * @param phone - Phone number string (digits only or with formatting)
 * @returns Formatted phone number string
 */
export const formatUzbekPhone = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')

  // If starts with 998, keep it; otherwise assume it's local and add 998
  let digits = cleaned
  if (!digits.startsWith('998') && digits.length > 0) {
    digits = '998' + digits
  }

  // Limit to 12 digits (998 + 9 digits)
  digits = digits.slice(0, 12)

  // Format: +998 XX XXX XX XX
  if (digits.length === 0) {
    return ''
  }

  if (digits.length <= 3) {
    return `+${digits}`
  }

  if (digits.length <= 5) {
    return `+${digits.slice(0, 3)} ${digits.slice(3)}`
  }

  if (digits.length <= 8) {
    return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5)}`
  }

  if (digits.length <= 10) {
    return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`
  }

  return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10)}`
}

/**
 * Cleans phone number to digits only (removes formatting)
 * @param phone - Phone number string (formatted or not)
 * @returns Clean phone number with digits only
 */
export const cleanPhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, '')
}
