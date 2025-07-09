export const parseDurationToMinutes = (durationString: string): number => {
  let totalMinutes = 0
  const hoursMatch = durationString.match(/(\d+)\s*h/)
  const minutesMatch = durationString.match(/(\d+)\s*m/)

  if (hoursMatch) {
    totalMinutes += parseInt(hoursMatch[1], 10) * 60
  }
  if (minutesMatch) {
    totalMinutes += parseInt(minutesMatch[1], 10)
  }

  return totalMinutes
}
