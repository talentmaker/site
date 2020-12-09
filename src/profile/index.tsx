import "./index.scss"
import type {CognitoUser} from "../cognito-utils"
import React from "react"
import UserContext from "../userContext"

declare namespace Types {

    export interface Props {
        user?: CognitoUser,
    }

    export interface SubComponentProps {
        user: CognitoUser,
    }

}

export default class UserDisplay extends React.Component<Types.Props> {

    protected userInfo = ({user}: Types.SubComponentProps): JSX.Element => (
        <UserContext.Consumer>
            {({setUser}): JSX.Element => (
                <div className="row">
                    <div className="col-lg-2">
                        <div className="px-4 my-3">
                            <img src="images/profile.svg" className="pfp" alt="Profile"/>
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
                            onClick={(): Promise<void> => setUser(undefined)}
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
                    <li>UUID (short): {user.sub.slice(0, 8)}</li>
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
