import EditCompetitionComponent from "../components/pages/editCompetition"
import {useParams} from "react-router"

export const EditCompetition: React.FC = () => {
    const {id} = useParams<{id: string}>()

    return (
        <EditCompetitionComponent id={id === "new" || id === undefined ? undefined : Number(id)} />
    )
}

export default EditCompetition
