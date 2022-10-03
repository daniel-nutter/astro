// @ts-nocheck
export function findCombos(arr) {
    return arr.reduce(
        (a, b) =>
            a
                .map((x) => b.map((y) => x.concat(y)))
                .reduce((a, b) => a.concat(b), []),
        [[]]
    )
}
