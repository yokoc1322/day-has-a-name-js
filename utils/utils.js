export function getStateIcon(state) {
  const table = {
    great: 'mdi-weather-sunny',
    good: 'mdi-weather-hazy',
    bad: 'mdi-weather-puring'
  }
  return table[state]
}
