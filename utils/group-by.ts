export interface Grouping<T> {
    key: string,
    items: T[]
}

export function groupBy<T>(arr: T[], key: (T) => string): Grouping<T>[] {
    const groupings = arr.reduce(reducer(key), {});
    const entries = Object.entries(groupings) as [[string, T[]]];
    return entries.map(([key, items]) => ({key, items}));
}

const reducer = (key) => <T>(groups: {}, item: T): {} => {
    const k = key(item);
    return {
        ...groups,
        [k]: [
            ...(groups[k] || []),
            item
        ]
    }
};
