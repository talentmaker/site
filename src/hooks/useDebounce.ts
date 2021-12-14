/**
 * This is free and unencumbered software released into the public domain.
 *
 * @license Unlicense
 * @see {@link https://usehooks.com/useDebounce/}
 */

import React from "react"

export const useDebounce = <T>(
    value: T,
    delay: number,
): {value: T; isWaiting: boolean; setImmediately: () => void; clearDebounce: () => void} => {
    const [debouncedValue, setDebouncedValue] = React.useState(value)
    const [isWaiting, setIsWaiting] = React.useState(false)
    const timeout = React.useRef<NodeJS.Timeout>()

    const clearDebounce = React.useCallback(() => {
        clearTimeout(timeout.current!)
        setIsWaiting(false)
    }, [])

    const setImmediately = React.useCallback(() => {
        setDebouncedValue(value)
        clearDebounce()
    }, [`${timeout.current}`, value])

    React.useEffect(() => {
        setIsWaiting(true)
        timeout.current = setTimeout(() => {
            setDebouncedValue(value)
            setIsWaiting(false)
        }, delay)

        return () => {
            clearDebounce()
        }
    }, [value, delay])

    return {value: debouncedValue, isWaiting, setImmediately, clearDebounce}
}
