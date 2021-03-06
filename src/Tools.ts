
export function measureTime<T>(opTitle: string, op: () => T ): T {
    console.time(opTitle);
    try {
        return op()
    } finally {
        console.timeEnd( opTitle )
    }
}