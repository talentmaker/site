/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import React from "react"
import qs from "query-string"
import {useHistory} from "react-router"

type UseQueryReturn<T extends qs.ParsedQuery = qs.ParsedQuery> = {
    query: Partial<T>
    rawQuery: string
    setRawQuery: (rawQuery: string) => void
    setQuery: (query: T) => void
}

export const useQuery = <T extends qs.ParsedQuery = qs.ParsedQuery>(): UseQueryReturn<T> => {
    const [rawQuery, setRawQuery] = React.useState("")
    const [query, setQuery] = React.useState<T>({} as T)
    const history = useHistory()

    const queryChangeHandler = () => {
        if (window.location.search !== rawQuery) {
            setRawQuery(window.location.search)
            setQuery(qs.parse(window.location.search) as T)
        }
    }

    React.useEffect(() => {
        setRawQuery(window.location.search)
        setQuery(qs.parse(window.location.search) as T)
        window.addEventListener("locationchange", queryChangeHandler)

        return () => {
            window.removeEventListener("locationchange", queryChangeHandler)
        }
    }, [])

    const setRawQueryPublic = (queryString: string) => {
        history.push(
            qs.stringifyUrl({
                url: `${window.location.pathname}`,
                query: qs.parse(queryString),
            }),
        )
    }

    const setQueryPublic = (queryObject: T) => {
        history.push(
            qs.stringifyUrl({
                url: `${window.location.pathname}`,
                query: queryObject,
            }),
        )
    }

    return {query, rawQuery, setRawQuery: setRawQueryPublic, setQuery: setQueryPublic}
}

export default useQuery
