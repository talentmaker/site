/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import * as adapters from "~/adapters"
import {Button, Container} from "react-bootstrap"
import {Link, useNavigate} from "react-router-dom"
import {NotificationContext, UserContext} from "~/contexts"
import MetaTags from "~/components/metaTags"
import React from "react"
import {Spinner} from "~/components/bootstrap"
import {useAdapter} from "~/hooks"

type Props = {
    data: string
}

export const JoinTeam: React.FC<Props> = ({data}) => {
    const {data: inviteLinkData} = useAdapter(() => adapters.team.getInviteLinkData(data))
    const [isJoining, setIsJoining] = React.useState(false)
    const {currentUser: user} = React.useContext(UserContext)
    const {addNotification: notify} = React.useContext(NotificationContext)
    const navigate = useNavigate()

    const joinTeam = async () => {
        if (user && inviteLinkData) {
            setIsJoining(true)

            const err = await adapters.team.join(user, data)

            if (!(err instanceof Error)) {
                notify({
                    title: "Successfully Joined Team!",
                    content: `Success! You can now edit the project ${inviteLinkData.projectName}.`,
                    icon: "done",
                    iconClassName: "text-success",
                })
                navigate(`/project/${inviteLinkData.projectId}`)
            }

            setIsJoining(false)
        }
    }

    if (!user) {
        return (
            <>
                <p>Error: unauthenticated</p>
                <MetaTags statusCode={401} />{" "}
            </>
        )
    } else if (!inviteLinkData) {
        return <Spinner color="primary" size="25vw" className="my-5" centered />
    } else if (Date.now() > inviteLinkData.expiry) {
        // Don't worry, there's a server side check for this too
        return (
            <>
                <p>Error: your link is expired</p>
                <MetaTags statusCode={410} />
            </>
        )
    }

    return (
        <>
            <Container fluid className="py-5" style={{height: "65vh"}}>
                <h1>Join Team</h1>
                <ul>
                    <li>
                        Project name:{" "}
                        <Link to={`/project/${inviteLinkData.projectId}`}>
                            <code>{inviteLinkData.projectName}</code>
                        </Link>
                    </li>
                    <li>
                        Project creator: <code>{inviteLinkData.projectCreator}</code>
                    </li>
                    <li>
                        Competition name:{" "}
                        <Link to={`/competition/${inviteLinkData.competitionId}`}>
                            <code>{inviteLinkData.competitionName}</code>
                        </Link>
                    </li>
                    <li>
                        Competition creator: <code>{inviteLinkData.competitionCreator}</code>
                    </li>
                </ul>
                <p>
                    Are you sure you would like to join the team for{" "}
                    <code>{inviteLinkData.projectName}</code> for the competition{" "}
                    <code>{inviteLinkData.competitionName}</code>?
                </p>
                <Button variant="success" onClick={joinTeam} className="me-3">
                    {isJoining ? <Spinner inline> </Spinner> : undefined}
                    Yes
                </Button>
                <Button variant="outline-danger" to="/" as={Link} disabled={isJoining}>
                    No
                </Button>
            </Container>
            <MetaTags title={`Join ${inviteLinkData.competitionCreator}'s Team`} />
        </>
    )
}

export default JoinTeam
