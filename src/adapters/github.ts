/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import {githubLicenseResult, githubReadmeResult, githubRepoResult} from "~/schemas/github"
import {inlineTryPromise, isErrorLike} from "@luke-zhang-04/utils"
import {request} from "~/utils"

type GithubRepoAdapterResult = {
    desc?: string
    srcURL?: string
    demoURL?: string
    license?: string
    name: string
}

export const githubRepoAdapter = async (
    repoName: string,
): Promise<GithubRepoAdapterResult | Error> => {
    try {
        const repoDetails = await githubRepoResult.validate(
            await request(`https://api.github.com/repos/${repoName}`, "GET", "json"),
        )
        const readme = await inlineTryPromise(
            async () =>
                await githubReadmeResult.validate(
                    await request(
                        `https://api.github.com/repos/${repoName}/readme`,
                        "GET",
                        "json",
                    ),
                ),
            false,
        )
        const license =
            repoDetails.license.spdx_id === "NOASSERTION"
                ? (
                      await inlineTryPromise(
                          async () =>
                              await githubLicenseResult.validate(
                                  await request(
                                      `https://api.github.com/repos/${repoName}/license`,
                                      "GET",
                                      "json",
                                  ),
                              ),
                          false,
                      )
                  )?.html_url
                : repoDetails.license.spdx_id

        return {
            desc: readme
                ? Buffer.from(readme.content, readme.encoding as BufferEncoding).toString("utf-8")
                : undefined,
            srcURL: repoDetails.html_url,
            demoURL: repoDetails.homepage ?? repoDetails.html_url,
            license,
            name: repoDetails.name,
        }
    } catch (err) {
        if (err instanceof Error) {
            return err
        }

        return isErrorLike(err) ? new Error(err.message) : new Error(String(err))
    }
}
