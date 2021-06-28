/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import type * as Components from "~/components/detailedItem"
import type {Project as ProjectType} from "~/schemas/project"
import osiLicenses from "osi-licenses"
import spdxLicenses from "spdx-license-ids"

type Data = {
    src: string
    items: React.ComponentProps<typeof Components.Sidebar>["items"]
}

const getProjectLicense = (license: string): Data["items"][0] => {
    if (license in osiLicenses) {
        return {
            icon: "gavel",
            contents: osiLicenses[license],
            href: `https://opensource.org/licenses/${license}`,
        }
    } else if (spdxLicenses.includes(license)) {
        return {
            icon: "gavel",
            contents: license,
            href: `https://spdx.org/licenses/${license}`,
        }
    } else if (/^http/u.test(license)) {
        return {
            icon: "gavel",
            href: license,
            contents: license,
        }
    }

    return {
        icon: "gavel",
        contents: license,
    }
}

export const getProjectData = (project?: ProjectType): Data | undefined =>
    project === undefined
        ? undefined
        : {
              items: [
                  {
                      title: "Competition: ",
                      to: `/competition/${project.competitionId}`,
                      contents: project.competitionName,
                  },
                  {
                      icon: "account_circle",
                      contents: project.creatorUsername,
                  },
                  project.srcURL
                      ? {
                            icon: "code",
                            href: project.srcURL,
                            contents: project.srcURL,
                        }
                      : undefined,
                  project.demoURL
                      ? {
                            icon: "preview",
                            href: project.demoURL,
                            contents: project.demoURL,
                        }
                      : undefined,
                  project.videoURL
                      ? {
                            icon: "video_library",
                            href: project.videoURL,
                            contents: project.videoURL,
                        }
                      : undefined,
                  project.license ? getProjectLicense(project.license) : undefined,
              ],
              src:
                  project.videoURL
                      ?.replace("watch?v=", "embed/")
                      .replace("https://youtu.be", "https://www.youtube.com/embed") ?? "",
          }

export default getProjectData
