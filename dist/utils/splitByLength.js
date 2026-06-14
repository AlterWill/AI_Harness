export default function splitByLength(str, splitLength) {
    if (splitLength <= 0)
        throw new Error("Split Length can not be less than 0");
    if (str === "")
        return [];
    const result = [];
    for (let i = 0; i < str.length; i += splitLength) {
        result.push(str.slice(i, i + splitLength));
    }
    return result;
}
//# sourceMappingURL=splitByLength.js.map