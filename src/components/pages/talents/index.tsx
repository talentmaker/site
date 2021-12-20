/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import * as adapters from "~/adapters"
import {Container, FormControl, InputGroup, Row} from "react-bootstrap"
import {useAdapter, useDebounce, useFunctionMemoPromise, useQuery} from "~/hooks"
import GridItem from "~/components/gridItem"
import MetaTags from "~/components/metaTags"
import React from "react"
import {Spinner} from "~/components/bootstrap"
import {arrayToChunks} from "@luke-zhang-04/utils"
import defaultProfileImage from "~/images/profile.svg"
import {secsToMs} from "@luke-zhang-04/dateplus"

const debounceTimeout = 1

export const Talents: React.FC = () => {
    const {query, setQuery} = useQuery<{query?: string}>()
    const [search, searchCache] = useFunctionMemoPromise((term: string) =>
        adapters.user.getMany(term),
    )
    const {data: users, setData, setError, isLoading, setIsLoading} = useAdapter(() => search(""))
    const [searchTerm, setSearchTerm] = React.useState("")
    const {
        value: debounceSearchTerm,
        isWaiting,
        setImmediately,
        clearDebounce,
    } = useDebounce(searchTerm, secsToMs(debounceTimeout))

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
            setData(cacheEntry)
        }
    }, [searchTerm])

    React.useEffect(() => {
        setIsLoading(true)
        search(debounceSearchTerm)
            .then((newUsers) => {
                if (newUsers instanceof Error) {
                    setError(newUsers)
                } else {
                    setData(newUsers)
                }
            })
            .catch(() => {})
    }, [debounceSearchTerm])

    if (users) {
        const searchBar = (
            <InputGroup className="mb-3">
                <InputGroup.Text>
                    <span className="material-icons">search</span>
                </InputGroup.Text>
                <FormControl
                    className="bg-lighter"
                    value={searchTerm}
                    onChange={(event) => {
                        event.preventDefault()
                        setSearchTerm(event.target.value)
                    }}
                    onKeyUp={(event) => {
                        event.preventDefault()
                        if (event.code === "Enter") {
                            setImmediately()
                        }
                    }}
                    placeholder="Search users"
                />
            </InputGroup>
        )

        if (isWaiting || isLoading) {
            return (
                <>
                    <Container fluid className="py-3">
                        <h1>Talents</h1>
                        {searchBar}
                    </Container>
                    <Spinner color="primary" size="25vw" className="my-5" centered />
                </>
            )
        }

        const chunkedUsers = arrayToChunks(users, 3)

        return (
            <>
                <Container fluid className="py-3">
                    <h1>Talents</h1>
                    {searchBar}
                    {users.length === 0 ? (
                        <p>No results</p>
                    ) : (
                        chunkedUsers.map((userRow) => (
                            <Row
                                key={`comp-row-${userRow.reduce(
                                    (prev, current) => prev + current.uid,
                                    "",
                                )}`}
                                className="g-3 mt-0"
                            >
                                {userRow.map((user) => (
                                    <GridItem
                                        key={`grid-item-${user.uid}`}
                                        imageURL={defaultProfileImage}
                                        tag={user.uid.slice(0, 8)}
                                        title={user.username}
                                        desc={`${user.projectCount} project${
                                            user.projectCount === 1 ? "" : "s"
                                        } so far`}
                                        link={{to: `/profile/${user.uid}`, text: "More info"}}
                                    />
                                ))}
                            </Row>
                        ))
                    )}
                </Container>
                <MetaTags />
            </>
        )
    }

    return <Spinner color="primary" size="25vw" className="my-5" centered />
}

export default Talents
