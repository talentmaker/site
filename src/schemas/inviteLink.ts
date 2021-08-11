/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import * as yup from "yup"

export const inviteLinkSchema = yup.object({
    projectId: yup.number().required(),
    competitionId: yup.number().required(),
    expiry: yup.number().required(),
    projectName: yup.string().required(),
    projectCreator: yup.string().required(),
    competitionName: yup.string().required(),
    competitionCreator: yup.string().required(),
})

export type InviteLink = typeof inviteLinkSchema["__outputType"]
