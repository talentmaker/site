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
import {githubRepoAdapter} from "~/adapters/github"
import {pick} from "@luke-zhang-04/utils"
import qs from "query-string"
import {useHistory} from "react-router"

interface Props {
    competition: Competition
    shouldShow: boolean
    onClose?: () => void
}

const GithubDisplay: React.FC<Props> = ({competition}) => {
    const [ghUsername, setGhUsername] = React.useState("")
    const [repoName, setRepoName] = React.useState("")
    const [isProcessing, setIsProcessing] = React.useState(false)
    const [error, setError] = React.useState<Error>()
    const {currentUser: user} = React.useContext(UserContext)
    const history = useHistory()

    const onSubmit: FormProps["onSubmit"] = async (event) => {
        event.preventDefault()

        if (user) {
            setIsProcessing(true)
            setError(undefined)

            const repoDetails = await githubRepoAdapter(`${ghUsername}/${repoName}`)

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
                    history.push(`/project?${qs.stringify({competition: competition.id})}`)
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

export const NewProjectModal: React.FC<Props> = ({competition, shouldShow, onClose}) => {
    const [shouldShowGithubForm, setShouldShowGithubForm] = React.useState(false)

    return (
        <Modal show={shouldShow} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    Create Submission for{" "}
                    {competition.name ?? `${competition.orgName}'s Competition`}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-light px-4 py-3">
                {shouldShowGithubForm ? (
                    <GithubDisplay {...{competition, shouldShow, onClose}} />
                ) : (
                    <div className="d-flex flex-row justify-content-start">
                        <Button variant="outline-primary">
                            <span className="material-icons">create</span> Create from Scratch
                        </Button>
                        <Button
                            className="ms-3"
                            variant="outline-dark"
                            onClick={() => setShouldShowGithubForm(true)}
                        >
                            <span className="bi-github" /> Import from Github
                        </Button>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer className={shouldShowGithubForm ? "justify-content-between" : undefined}>
                {shouldShowGithubForm && (
                    <Button variant="outline-dark" onClick={() => setShouldShowGithubForm(false)}>
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
