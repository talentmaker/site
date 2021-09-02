/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
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
    }, [adapterCall, isLoading])

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

    return {
        isLoading,
        isDone: !isLoading,
        data,
        error,
        rerun: callAdapter,
    } as UseAdapterReturn<OutputType>
}

export default useAdapter