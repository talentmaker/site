/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import * as adapters from "~/adapters"
import {Button, Form, FormProps, InputGroup, Modal} from "react-bootstrap"
import {Competition} from "~/schemas/competition"
import React from "react"
import {Spinner} from "~/components/bootstrap/spinner"
import {UserContext} from "~/contexts"
import {pick} from "@luke-zhang-04/utils"
import qs from "query-string"
import {useNavigate} from "react-router"

interface Props {
    competition: Competition
    shouldShow: boolean
    onClose?: () => void
}

interface DisplayProps {
    competition: Competition
}

const GithubDisplay: React.FC<DisplayProps> = ({competition}) => {
    const [ghUsername, setGhUsername] = React.useState("")
    const [repoName, setRepoName] = React.useState("")
    const [isProcessing, setIsProcessing] = React.useState(false)
    const [error, setError] = React.useState<Error>()
    const {currentUser: user} = React.useContext(UserContext)
    const navigate = useNavigate()

    const onSubmit: FormProps["onSubmit"] = async (event) => {
        event.preventDefault()

        if (user) {
            setIsProcessing(true)
            setError(undefined)

            const repoDetails = await adapters.github.getRepo(`${ghUsername}/${repoName}`)

            if (repoDetails instanceof Error) {
                if (repoDetails.message === "Not Found - Not Found") {
                    repoDetails.message = "Not Found - Repository Not Found"
                }

                setError(repoDetails)
            } else {
                const response = await adapters.project.create(user, {
                    title: repoDetails.name,
                    competitionId: competition.id,
                    ...pick(repoDetails, "srcURL", "demoURL", "license", "desc"),
                })

                if (response instanceof Error) {
                    setError(response)
                } else {
                    navigate(`/project?${qs.stringify({competition: competition.id})}`)
                }
            }

            setIsProcessing(false)
        }
    }

    return (
        <>
            <h1>Import from Github</h1>
            <p>Note: only public repositories are supported</p>
            <Form onSubmit={onSubmit}>
                <InputGroup className="border-none">
                    <InputGroup.Text>
                        <span className="bi-github" />
                    </InputGroup.Text>
                    <input
                        className="form-control bg-lighter"
                        value={ghUsername}
                        placeholder="Username"
                        onChange={(event) => {
                            setGhUsername(event.target.value)
                            setError(undefined)
                        }}
                    />
                    <InputGroup.Text>/</InputGroup.Text>
                    <input
                        className="form-control bg-lighter"
                        value={repoName}
                        placeholder="Repository Name"
                        onChange={(event) => {
                            setRepoName(event.target.value)
                            setError(undefined)
                        }}
                    />
                </InputGroup>
                {error && <p className="text-danger">{error.toString()}</p>}
                <div className="d-flex flex-row justify-content-end mt-3">
                    <Button variant="primary" type="submit" disabled={isProcessing}>
                        Import {isProcessing ? <Spinner inline /> : undefined}
                    </Button>
                </div>
            </Form>
        </>
    )
}

const InputDisplay: React.FC<DisplayProps> = ({competition}) => {
    const [title, setTitle] = React.useState("")
    const [isProcessing, setIsProcessing] = React.useState(false)
    const [error, setError] = React.useState<Error>()
    const {currentUser: user} = React.useContext(UserContext)
    const navigate = useNavigate()

    const onSubmit: FormProps["onSubmit"] = async (event) => {
        event.preventDefault()

        if (user) {
            setIsProcessing(true)
            setError(undefined)

            if (title) {
                const response = await adapters.project.create(user, {
                    title,
                    competitionId: competition.id,
                })

                if (response instanceof Error) {
                    setError(response)
                } else {
                    navigate(`/project?${qs.stringify({competition: competition.id})}`)
                }
            } else {
                setError(new Error("Title is a required field"))
            }

            setIsProcessing(false)
        }
    }

    return (
        <>
            <h1>Create From Scratch</h1>
            <Form onSubmit={onSubmit}>
                <InputGroup className="border-none">
                    <InputGroup.Text>
                        <span className="material-icons">title</span>
                    </InputGroup.Text>
                    <input
                        className="form-control bg-lighter"
                        value={title}
                        placeholder="Project Title"
                        onChange={(event) => {
                            setTitle(event.target.value)
                            setError(undefined)
                        }}
                    />
                </InputGroup>
                {error && <p className="text-danger">{error.toString()}</p>}
                <div className="d-flex flex-row justify-content-end mt-3">
                    <Button variant="primary" type="submit" disabled={isProcessing}>
                        Create {isProcessing ? <Spinner inline /> : undefined}
                    </Button>
                </div>
            </Form>
        </>
    )
}

export const NewProjectModal: React.FC<Props> = ({competition, shouldShow, onClose}) => {
    const [display, setDisplay] = React.useState<"main" | "github" | "input">("main")
    const {currentUser: user} = React.useContext(UserContext)

    if (!user) {
        return (
            <Modal show={shouldShow} onHide={onClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>You are not logged in</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="danger" onClick={onClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    const displays = {
        main: (
            <div className="d-flex flex-row justify-content-start">
                <Button variant="outline-primary" onClick={() => setDisplay("input")}>
                    <span className="material-icons">create</span> Create from Scratch
                </Button>
                <Button
                    className="ms-3"
                    variant="outline-dark"
                    onClick={() => setDisplay("github")}
                >
                    <span className="bi-github" /> Import from Github
                </Button>
            </div>
        ),
        github: <GithubDisplay competition={competition} />,
        input: <InputDisplay competition={competition} />,
    }

    return (
        <Modal show={shouldShow} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    Create Submission for{" "}
                    {competition.name ?? `${competition.orgName}'s Competition`}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-light py-3">{displays[display]}</Modal.Body>
            <Modal.Footer className={display === "main" ? undefined : "justify-content-between"}>
                {display !== "main" && (
                    <Button variant="outline-dark" onClick={() => setDisplay("main")}>
                        <span className="material-icons">arrow_back_ios_new</span> back
                    </Button>
                )}
                <Button variant="danger" onClick={onClose}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default NewProjectModal
