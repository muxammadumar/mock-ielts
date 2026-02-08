/**
 * Format seconds to MM:SS format
 * @param seconds - Time in seconds
 * @returns Formatted time string (e.g., "05:32", "40:00")
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
