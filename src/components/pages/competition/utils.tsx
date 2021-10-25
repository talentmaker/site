/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import type * as Components from "~/components/detailedItem"
import type {Competition as CompetitionType} from "~/schemas/competition"
import DatePlus from "@luke-zhang-04/dateplus"

type Data = {
    src: string
    deadline?: DatePlus
    items: React.ComponentProps<typeof Components.Sidebar>["items"]
}

export const getCompetitionData = (_competition: CompetitionType): Data => {
    const deadline = _competition.deadline ? new DatePlus(_competition.deadline) : undefined

    deadline?.setMinutes(
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
                        <span className="text-muted">
                            #{_competition.organizationId.slice(0, 7)}
                        </span>
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
            deadline
                ? {
                      icon: "event",
                      contents: `${deadline.getWordMonth()} ${deadline.getDate()}, ${deadline.getFullYear()}@${
                          deadline.getHours() < 10
                              ? `0${deadline.getHours()}`
                              : deadline.getHours()
                      }:${deadline.getMinutes()}`,
                  }
                : undefined,
        ],
        src:
            _competition.videoURL
                ?.replace("watch?v=", "embed/")
                .replace("https://youtu.be", "https://www.youtube.com/embed") ?? "",
        deadline,
    }
}

export default getCompetitionData
