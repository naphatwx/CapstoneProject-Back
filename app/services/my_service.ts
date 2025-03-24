const ensureArray = <T>(value: T | T[]): T[] => {
    // Check if value is already an array
    if (Array.isArray(value)) {
        return value
    }
    // If not an array, convert to array with single element
    return [value]
}

export default {
    ensureArray
}