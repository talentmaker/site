/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import DefaultPFP from "~/images/profile.svg"
import React from "react"
import UserContext from "~/contexts/userContext"
import notify from "~/utils/notify"
import orgRequestAdapter from "~/adapters/orgRequest"
import styles from "./index.module.scss"
import {useHistory} from "react-router-dom"

const makeOrgRequest = async (user: User): Promise<void> => {
    const data = await orgRequestAdapter(user)

    if (!(data instanceof Error)) {
        notify({
            title: "Successfully Made Request!",
            content: "Success! You have requested to become an organization!",
            icon: "account_box",
            iconClassName: "text-success",
        })
    }
}

export const UserDisplay: React.FC = () => {
    const history = useHistory()

    const orgRequest = React.useCallback(makeOrgRequest, [])

    return (
        <UserContext.Consumer>
            {({currentUser: user, setUser}): JSX.Element =>
                user === undefined ? (
                    <div className="container">It looks like you&apos;ve been signed out</div>
                ) : (
                    <>
                        <div className="row">
                            <div className="col-lg-2">
                                <div className="px-4 my-3">
                                    <img src={DefaultPFP} className={styles.pfp} alt="Profile" />
                                </div>
                            </div>
                            <div className="col-lg-6 d-flex flex-column justify-content-center">
                                <p className={styles.username}>
                                    {user.username}
                                    <span className="text-muted">#{user.sub.slice(0, 8)}</span>
                                </p>
                                <p className={`${styles.sub} text-muted`}>{user.sub}</p>
                            </div>
                            <div className="col-lg-4 d-flex flex-row align-items-center justify-content-end">
                                <button className="btn btn-outline-primary btn-lg">Edit</button>
                                <button
                                    className="btn btn-outline-danger btn-lg mx-4"
                                    onClick={async (): Promise<void> => {
                                        await setUser(undefined)

                                        return history.push("/")
                                    }}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>

                        <div className={`row bg-primary ${styles.bar}`}>
                            <div className="col-sm-12"></div>
                        </div>

                        <div className="row">
                            <div className="col-3 bg-lighter">
                                <ul className="list-unstyled text-dark px-4 py-5">
                                    <li>Email: {user.email}</li>
                                    <br />
                                    <li>Username: {user.username}</li>
                                    <br />
                                    <li>UID (short): {user.sub.slice(0, 8)}</li>
                                    <br />
                                    An organization? Apply to become an organization!
                                    <br />
                                    <button
                                        className="btn btn-outline-primary"
                                        onClick={(): Promise<void> => orgRequest(user)}
                                    >
                                        Apply
                                    </button>
                                </ul>
                            </div>
                            <div className="col-9">
                                <h1>Projects:</h1>
                            </div>
                        </div>
                    </>
                )
            }
        </UserContext.Consumer>
    )
}

export default UserDisplay
