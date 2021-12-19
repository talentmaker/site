/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import type * as yup from "yup"
import type {AdapterReturnTypeOrError} from "~/adapters/utils/createAdapter"
import type {MaybePromise} from "@luke-zhang-04/utils/types"
import React from "react"

type UseAdapterReturn<OutputType> = (
    | {
          isLoading: true
          isDone: false
          data: undefined
          error: undefined
      }
    | {
          isLoading: false
          isDone: true
          data: OutputType
          error: undefined
      }
    | {
          isLoading: false
          isDone: false
          isSuccessful: false
          data: undefined
          error: Error
      }
) & {
    /**
     * Reruns the adapter without the cache, keeping the already stored data until the adapter
     * returns a result
     */
    rerun: () => void

    /**
     * Manually set the data and toggle isLoading and isDone. Erases errors.
     */
    setData: React.Dispatch<React.SetStateAction<OutputType | undefined>>

    /**
     * Manually set the error and toggle isLoading and isDone.
     */
    setError: React.Dispatch<React.SetStateAction<Error | undefined>>

    /**
     * Manually set isLoading and toggle isDone.
     */
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export const useAdapter = <
    Schema extends yup.BaseSchema | undefined = undefined,
    OutputType extends Schema extends yup.BaseSchema
        ? Schema["__outputType"]
        : undefined = Schema extends yup.BaseSchema ? Schema["__outputType"] : undefined,
>(
    adapterCall: () => MaybePromise<AdapterReturnTypeOrError<Schema>> | undefined,
    cacheHook?: () => MaybePromise<OutputType | undefined>,
    deps: React.DependencyList = [],
): Readonly<UseAdapterReturn<OutputType>> => {
    const [isLoading, setIsLoading] = React.useState(true)
    const [data, setData] = React.useState<OutputType>()
    const [error, setError] = React.useState<Error>()

    const callAdapter = React.useCallback(() => {
        Promise.resolve(adapterCall())
            .then((val) => {
                if (val instanceof Error) {
                    setError(val)
                } else if (val !== undefined) {
                    setData(val)
                    setError(undefined)
                }
            })
            .catch((err) =>
                err instanceof Error ? setError(err) : setError(new Error(String(err))),
            )
            .finally(() => {
                if (isLoading) {
                    setIsLoading(false)
                }
            })
    }, [adapterCall, isLoading, ...deps])

    React.useEffect(() => {
        if (cacheHook !== undefined && isLoading) {
            Promise.resolve(cacheHook())
                .then((val) => {
                    if (val !== undefined && isLoading) {
                        setData(val)
                        setIsLoading(false)
                    }
                })
                .catch(() => {})
        }

        callAdapter()
    }, deps)

    const publicSetData = React.useCallback<
        React.Dispatch<React.SetStateAction<OutputType | undefined>>
    >((_data) => {
        setData(_data)
        setError(undefined)
        setIsLoading(_data === undefined && error === undefined)
    }, [])

    const publicSetError = React.useCallback<
        React.Dispatch<React.SetStateAction<Error | undefined>>
    >((_error) => {
        setError(_error)
        setIsLoading(data === undefined && _error === undefined)
    }, [])

    return {
        isLoading,
        isDone: !isLoading,
        data,
        error,
        rerun: callAdapter,
        setData: publicSetData,
        setError: publicSetError,
        setIsLoading,
    } as UseAdapterReturn<OutputType>
}

export default useAdapter
