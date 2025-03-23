const pascalToNormal = (text: string) => {
    return text
        .replace(/([A-Z])/g, " $1")  // Add space before capital letters
        .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
        .trim()
}

export default { pascalToNormal }
