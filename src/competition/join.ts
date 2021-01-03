/**
 * Talentmaker website
 *
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 * @author Luke Zhang
 *
 * @license BSD-3-Clause
 */

import {CognitoUser} from "../cognito-utils"
import {url} from "../globals"

export const join = async (
    user: CognitoUser,
    competitionId: number,
): Promise<boolean> => {
    const {idToken, idTokenChecksum} = user,

        data = await fetch(
            `${url}/competitions/join`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    idToken,
                    idTokenChecksum,
                    competitionId,
                }),
            },
        )

    return data.ok
}

export default join
