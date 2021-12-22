/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import {FormControl, InputGroup} from "react-bootstrap"
import type React from "react"

interface SearchBarProps {
    searchTerm: string
    onChange: (value: string) => void
    onPressEnter: () => void
}

export const SearchBar: React.FC<SearchBarProps> = ({searchTerm, onChange, onPressEnter}) => (
    <InputGroup className="mb-3">
        <InputGroup.Text>
            <span className="material-icons">search</span>
        </InputGroup.Text>
        <FormControl
            className="bg-lighter"
            value={searchTerm}
            onChange={(event) => {
                event.preventDefault()
                onChange(event.target.value)
            }}
            onKeyUp={(event) => {
                event.preventDefault()
                if (event.code === "Enter") {
                    onPressEnter()
                }
            }}
            placeholder="Search users"
        />
    </InputGroup>
)

export default SearchBar
