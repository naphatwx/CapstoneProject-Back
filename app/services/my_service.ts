const ensureArray = <T>(value: T | T[]): T[] => {
    // Check if value is already an array
    if (Array.isArray(value)) {
        return value
    }
    // If not an array, convert to array with single element
    return [value]
}

const sortObjectsByReference = <T>(arrayToSort: T[], referenceArray: any[], key: keyof T): T[] => {
    return arrayToSort.sort((a, b) => {
        return referenceArray.indexOf(a[key]) - referenceArray.indexOf(b[key])
    })
}

const convertToNumbers = (array: string[]): number[] => {
    return array.map(Number)
}

export default {
    ensureArray,
    sortObjectsByReference,
    convertToNumbers
}