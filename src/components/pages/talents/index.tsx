/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import * as adapters from "~/adapters"
import {Container, Row} from "react-bootstrap"
import GridItem from "~/components/gridItem"
import MetaTags from "~/components/metaTags"
import React from "react"
import SearchBar from "~/components/searchBar"
import {Spinner} from "~/components/bootstrap"
import {arrayToChunks} from "@luke-zhang-04/utils"
import defaultProfileImage from "~/images/profile.svg"
import {useDebounceSearch} from "~/hooks"

export const Talents: React.FC = () => {
    const {
        adapter: {data: users, isLoading},
        search: {searchTerm, setSearchTerm},
        debounce: {setImmediately, isWaiting},
    } = useDebounceSearch(adapters.user.getMany)

    if (users) {
        const searchBar = (
            <SearchBar
                searchTerm={searchTerm}
                onChange={setSearchTerm}
                onPressEnter={setImmediately}
                placeholder="Search Users"
            />
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
