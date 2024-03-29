/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import * as yup from "yup"
import {createAdapter} from "./utils"
import {inviteLinkSchema} from "~/schemas/inviteLink"

export const join = createAdapter(async ({request, url}, user: User, data: string) => {
    await request(`${url}/teams/join/${data}`, "POST", undefined, {
        idToken: user.idToken,
    })
})

export const getInviteLinkData = createAdapter(async ({request, url, schema}, data: string) => {
    const body = await request(`${url}/teams/getLinkData/${data}`, "GET", "json")

    return await schema.validate(body)
}, inviteLinkSchema.shape({}))

export const getInviteLink = createAdapter(
    async ({request, url, qs, schema}, user: User, projectId: string, competitionId: string) => {
        const body = await request(
            `${url}/teams/getLink?${qs.stringify({
                idToken: user.idToken,
                projectId,
                competitionId,
            })}`,
            "GET",
            "json",
        )

        return schema.validate(body)
    },
    yup.object({
        message: yup.string().required().equals(["Success!"]),
        urlSuffix: yup.string().required(),
    }),
)
