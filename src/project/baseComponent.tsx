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

export type Project = {
    id: number,
    creator: string,
    createdAt: Date,
    desc?: string,
    srcURL?: string,
    demoURL?: string,
    license?: string,
    videoURL?: string,
    coverImageURL?: string,
    competitionId: number,
    name: string,
}

export const isProject = (obj: {[key: string]: unknown}): obj is Project => (
    typeof obj?.id === "number" &&
    typeof obj.creator === "string" &&
    typeof obj.competitionId === "number" &&
    typeof obj.name === "string"
)
