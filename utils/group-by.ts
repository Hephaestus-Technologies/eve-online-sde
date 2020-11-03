export interface Grouping<T> {
    key: string,
    items: T[]
}

export function groupBy<T>(arr: T[], key: (T) => string): Grouping<T>[] {
    const reducer = (groups: {}, item: T): {} => {
        const k = key(item);
        return {
            ...groups,
            [k]: [
                ...(groups[k] || []),
                item
            ]
        }
    };
    return Object.values(arr.reduce(reducer, {}));
}
