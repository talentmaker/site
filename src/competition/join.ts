/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import {CognitoUser} from "../utils/cognito"
import handleError from "../errorHandler"
import {url} from "../globals"

export const join = async (user: CognitoUser, competitionId: number): Promise<boolean> => {
    const {idToken, idTokenChecksum} = user;
        const data = await fetch(`${url}/competitions/join`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                idToken,
                idTokenChecksum,
                competitionId,
            }),
        })

    if (!data.ok) {
        const error: unknown = await data.json()

        handleError(error)
    }

    return data.ok
}

export default join
