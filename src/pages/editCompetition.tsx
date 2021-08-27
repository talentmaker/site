/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
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
