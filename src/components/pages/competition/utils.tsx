/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import type * as Components from "../../detailedItem"
import type {Competition as CompetitionType} from "../../../schemas/competition"
import DatePlus from "@luke-zhang-04/dateplus"

type Data = {
    src: string
    deadline: DatePlus
    items: React.ComponentProps<typeof Components.Sidebar>["items"]
}

export const getCompetitionData = (_competition: CompetitionType): Data => {
    const deadline = new DatePlus(_competition.deadline)

    deadline.setMinutes(
        // Offset from UTC Time
        deadline.getMinutes() - deadline.getTimezoneOffset(),
    )

    return {
        items: [
            {
                title: "Talentmaker: ",
                contents: (
                    <>
                        {" "}
                        {_competition.orgName}
                        <span className="text-muted">#{_competition.orgId.slice(0, 7)}</span>
                    </>
                ),
            },
            _competition.website
                ? {
                      icon: "language",
                      contents: _competition.website,
                      href: _competition.website,
                  }
                : undefined,
            {
                icon: "mail",
                contents: _competition.email,
                href: `mailto:${_competition.email}`,
            },
            {
                icon: "event",
                contents: `${deadline.getWordMonth()} ${deadline.getDate()}, ${deadline.getFullYear()}@${
                    deadline.getHours() < 10 ? `0${deadline.getHours()}` : deadline.getHours()
                }:${deadline.getMinutes()}`,
            },
        ],
        src:
            _competition.videoURL
                ?.replace("watch?v=", "embed/")
                .replace("https://youtu.be", "https://www.youtube.com/embed") ?? "",
        deadline,
    }
}

export default getCompetitionData
