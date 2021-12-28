/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import {FormControl, InputGroup} from "react-bootstrap"
import MaterialIcons from "~/components/materialIcons"
import type React from "react"

interface SearchBarProps {
    searchTerm: string
    onChange: (value: string) => void
    onPressEnter: () => void
    placeholder: string
}

export const SearchBar: React.FC<SearchBarProps> = ({
    searchTerm,
    onChange,
    onPressEnter,
    placeholder,
}) => (
    <InputGroup className="mb-3">
        <InputGroup.Text>
            <MaterialIcons icon="search" />
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
            placeholder={placeholder}
        />
    </InputGroup>
)

export default SearchBar
