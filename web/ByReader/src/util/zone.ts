export function getZone(zones, width, height, x, y) {
  for (const zone in zones) {
    const value = zones[zone]
    for (const z of value) {
      if (x > z[0] * width && x < z[2] * width && y > z[1] * height && y < z[3] * height) {
        return zone
      }
    }
  }

  return null
}
