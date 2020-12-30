import "./index.scss"
import type {CognitoUser} from "../cognito-utils"
import DefaultPFP from "../images/profile.svg"
import type {History} from "history"
import React from "react"
import UserContext from "../userContext"
import notify from "../notify"
import {url} from "../globals"
import {useHistory} from "react-router-dom"

declare namespace Types {

    export interface WrapperProps {
        user?: CognitoUser,
    }

    export interface Props extends WrapperProps {
        history: History<unknown>["push"],
    }

    export interface SubComponentProps {
        user: CognitoUser,
    }

}

class UserDisplay extends React.Component<Types.Props> {

    private static _handleError = (err: unknown): void => {
        console.error(err)

        if (
            err instanceof Error ||
                typeof err === "object" &&
                typeof (err as {[key: string]: unknown}).message === "string"
        ) {
            notify({
                title: "Error",
                icon: "report_problem",
                iconClassName: "text-danger",
                content: `ERROR: ${(err as {[key: string]: unknown}).message as string}`,
            })
        } else {
            notify({
                title: "Error",
                icon: "report_problem",
                iconClassName: "text-danger",
                content: `ERROR: ${JSON.stringify(err)}`,
            })
        }
    }

    /**
     * Request to become organization
     */
    private _orgRequest = async (
        {user}: Types.SubComponentProps,
    ): Promise<void> => {
        try {
            const response = await fetch(`${url}/organization/request`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        idToken: user.idToken,
                        idTokenChecksum: user.idTokenChecksum,
                    }),
                }),
                data = await response.json()

            if (response.status === 200) {
                notify({
                    title: "Successfully Made Request!",
                    content: "Success! You have requested to become an organization!",
                    icon: "account_box",
                    iconClassName: "text-success",
                })
            } else {
                throw data
            }
        } catch (err: unknown) {
            UserDisplay._handleError(err)
        }
    }

    protected userInfo = ({user}: Types.SubComponentProps): JSX.Element => (
        <UserContext.Consumer>
            {({setUser}): JSX.Element => (
                <div className="row">
                    <div className="col-lg-2">
                        <div className="px-4 my-3">
                            <img src={DefaultPFP} className="pfp" alt="Profile"/>
                        </div>
                    </div>
                    <div className="col-lg-6 d-flex flex-column justify-content-center">
                        <p className="username">
                            {user.username}<span className="text-muted">#{user.sub.slice(0, 8)}</span>
                        </p>
                        <p className="sub text-muted">
                            {user.sub}
                        </p>
                    </div>
                    <div className="col-lg-4 d-flex flex-row align-items-center justify-content-end">
                        <button className="btn btn-outline-primary btn-lg">Edit</button>
                        <button
                            className="btn btn-outline-danger btn-lg mx-4"
                            onClick={async (): Promise<void> => {
                                await setUser(undefined)

                                return this.props.history("/")
                            }}
                        >Logout</button>
                    </div>
                </div>
            )}
        </UserContext.Consumer>
    )

    protected statsAndProjects = (
        {user}: Types.SubComponentProps,
    ): JSX.Element => (
        <div className="row">
            <div className="col-3 bg-darker">
                <ul className="list-unstyled text-light px-4 py-5">
                    <li>Email: {user.email}</li>
                    <br/>
                    <li>Username: {user.username}</li>
                    <br/>
                    <li>UID (short): {user.sub.slice(0, 8)}</li>
                    <br/>
                    An organization? Apply to become an organization!
                    <br/>
                    <button
                        className="btn btn-outline-primary"
                        onClick={(): Promise<void> => this._orgRequest({user})}
                    >Apply</button>
                </ul>
            </div>
            <div className="col-9">
                <h1>Projects:</h1>
            </div>
        </div>
    )

    protected profilePage = (): JSX.Element => {
        if (this.props.user === undefined) {
            return <div className="container">It looks like you&apos;ve been signed out</div>
        }

        return <>
            <this.userInfo user={this.props.user}/>

            <div className="row bg-primary bar">
                <div className="col-sm-12"></div>
            </div>

            <this.statsAndProjects user={this.props.user}/>
        </>
    }

    public render = (): JSX.Element => <this.profilePage/>

}

export const UserDisplayWithHistory: React.FC<Types.WrapperProps> = (props) => {
    const history = useHistory(),
        {push: changeHistory} = history

    return <UserDisplay history={changeHistory} {...props}/>
}

export default UserDisplayWithHistory
