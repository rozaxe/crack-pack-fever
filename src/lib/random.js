// Taken from https://stackoverflow.com/a/65440696

const MAX_RANGE_SIZE = 2 ** 53
const buffer = new Uint32Array(1024)
let offset = buffer.length

/**
 * Returns a cryptographically secure random integer between min and max, inclusive.
 *
 * @param {number} min - the lowest integer in the desired range (inclusive)
 * @param {number} max - the highest integer in the desired range (inclusive)
 * @returns {number} Random number
 */

export function randomInt(min, max) {
    if (!(Number.isSafeInteger(min) && Number.isSafeInteger(max))) {
        console.log(min, max)
        throw Error("min and max must be safe integers")
    }
    if (min > max) {
        throw Error("min must be less than or equal to max")
    }
    const rangeSize = max - min + 1
    if (rangeSize > MAX_RANGE_SIZE) {
        throw Error("(max - min) must be <= Number.MAX_SAFE_INTEGER")
    }
    const rejectionThreshold = MAX_RANGE_SIZE - (MAX_RANGE_SIZE % rangeSize)
    let result
    do {
        if ((offset + 1) >= buffer.length) {
            crypto.getRandomValues(buffer)
            offset = 0
        }
        result = (buffer[offset++] & 0x1f_ffff) * 0x1_0000_0000 + buffer[offset++]
    } while (result >= rejectionThreshold)
    return min + result % rangeSize
}
