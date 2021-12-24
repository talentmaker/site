/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import {useAdapter, useDebounce, useFunctionMemoPromise, useQuery} from "."
import type {AdapterReturnTypeOrError} from "~/adapters/utils/createAdapter"
import React from "react"
import type {UseAdapterReturn} from "./useAdapter"
import type {UseDebounceReturn} from "./useDebounce"
import {UseFunctionMemoPromiseReturn} from "./useFunctionMemo"
import type {UseQueryReturn} from "./useQuery"
import {secsToMs} from "@luke-zhang-04/dateplus"
import type yup from "yup"

const debounceTimeout = 1

/**
 * Monstrous type that includes data from all the hooks used below in case they're needed
 */
export type UseDebounceSearchReturn<T extends yup.BaseSchema | undefined> = {
    query: UseQueryReturn<{
        query?: string | undefined
    }>
    search: {
        search: UseFunctionMemoPromiseReturn<AdapterReturnTypeOrError<T>, [searchTerm: string]>[0]
        searchCache: UseFunctionMemoPromiseReturn<
            AdapterReturnTypeOrError<T>,
            [searchTerm: string]
        >[1]
        searchTerm: string
        setSearchTerm: (searchTerm: string) => void
    }
    debounce: UseDebounceReturn<string>
    adapter: UseAdapterReturn<T extends yup.BaseSchema ? T["__outputType"] : undefined>
}

export const useDebounceSearch = <T extends yup.BaseSchema | undefined>(
    searchFunction: (searchTerm: string) => Promise<AdapterReturnTypeOrError<T>>,
    adapterCacheFunction?: () => Promise<T extends yup.BaseSchema ? T["__outputType"] : undefined>,
): UseDebounceSearchReturn<T> => {
    const useQueryReturn = useQuery<{query?: string}>()
    const [search, searchCache] = useFunctionMemoPromise(searchFunction)
    const [searchTerm, setSearchTerm] = React.useState("")
    const useDebounceReturn = useDebounce(searchTerm, secsToMs(debounceTimeout))
    const useAdapterReturn = useAdapter(() => search(""), adapterCacheFunction)

    const {query, setQuery} = useQueryReturn
    const {value: debounceSearchTerm, setImmediately, clearDebounce} = useDebounceReturn
    const {setData, setError, setIsLoading} = useAdapterReturn

    React.useEffect(() => {
        if (query.query && searchTerm !== query.query) {
            setSearchTerm(query.query)
            setImmediately()
        }
    }, [query.query])

    React.useEffect(() => {
        setQuery(searchTerm ? {query: searchTerm} : {})
        const cacheEntry = searchCache(searchTerm)

        if (cacheEntry && !(cacheEntry instanceof Error)) {
            clearDebounce()
            setData?.(cacheEntry)
        }
    }, [searchTerm])

    React.useEffect(() => {
        setIsLoading?.(true)
        search(debounceSearchTerm)
            .then((newUsers) => {
                if (newUsers instanceof Error) {
                    setError?.(newUsers)
                } else {
                    setData?.(newUsers)
                }
            })
            .catch(() => {})
    }, [debounceSearchTerm])

    return {
        query: useQueryReturn,
        search: {
            search,
            searchCache,
            searchTerm,
            setSearchTerm,
        },
        debounce: useDebounceReturn,
        adapter: useAdapterReturn,
    }
}

export default useDebounceSearch
