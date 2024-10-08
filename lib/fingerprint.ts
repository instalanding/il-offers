import FingerprintJS from '@fingerprintjs/fingerprintjs'

// Initialize an agent at application startup.
const fpPromise = FingerprintJS.load();

// Create a function to get the visitor identifier.
export const getVisitorId = async () => {
  try {
    const fp = await fpPromise
    const result = await fp.get()
    return result.visitorId
  } catch (error) {
    console.error("Error getting visitor identifier:", error)
    return null // Handle the error or return a fallback value
  }
}
