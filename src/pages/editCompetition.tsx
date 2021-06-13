/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import EditCompetitionComponent from "../components/pages/editCompetition"
import {useParams} from "react-router"

export const EditCompetition: React.FC = () => {
    const {id} = useParams<{id: string}>()

    return (
        <EditCompetitionComponent id={id === "new" || id === undefined ? undefined : Number(id)} />
    )
}

export default EditCompetition
