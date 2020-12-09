/**
 * Talentmaker website
 *
 * @copyright (C) 2020 Luke Zhang, Ethan Lim
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
): Promise<void> => {
    const {idToken, idTokenChecksum} = user,

        data = await (await fetch(
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
        )).json() as {[key: string]: unknown}

    console.log(data)
}

export default join
