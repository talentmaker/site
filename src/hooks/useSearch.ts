/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import qs from "query-string"

export const useSearch = (): qs.ParsedQuery => qs.parse(window.location.search)

export default useSearch
