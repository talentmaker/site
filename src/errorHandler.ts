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

import notify from "./notify"

export const handleError = (err: unknown): void => {
    console.error(err)

    if (
        err instanceof Error ||
            typeof err === "object" &&
            typeof (err as {[key: string]: unknown}).message === "string"
    ) {
        notify({
            title: `${(err as {[key: string]: unknown}).name as string | undefined}` ?? "Error",
            icon: "report_problem",
            iconClassName: "text-danger",
            content: `${(err as {[key: string]: unknown}).message as string}`,
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

export default handleError
