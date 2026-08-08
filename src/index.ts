/**
 * Check if a given ip address is a loopback address
 */
export function isLoopbackAddr (ip: string): boolean {
  return /^127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(ip) ||
    /^::1$/.test(ip)
}
