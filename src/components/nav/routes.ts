export type MobileLinks = (
    | [path: string, displayName: string, iconName: string]
    | [
          authenticated: [path: string, displayName: string, iconName: string],
          unauthenticated: [path: string, displayName: string, iconName: string],
      ]
)[]

type DesktopLinkGroup = (
    | [path: string, displayName: string]
    | [href: string, iconType: "bootstrap" | "material-icons", iconName: string]
    | [
          authenticated: [path: string, displayName: string],
          unauthenticated: [path: string, displayName: string],
      ]
)[]

export type DesktopLinks = [left: DesktopLinkGroup, right: DesktopLinkGroup]

export const mobile: MobileLinks = [
    ["/competitions", "view_list", "Competitions"],
    ["/talents", "school", "Talents"],
    ["/", "home", "Home"],
    ["/talentmakers", "cases", "Talentmakers"],
    [
        ["/profile", "account_circle", "<USERNAME>"],
        ["/auth", "account_circle", "Sign Up"],
    ],
]

export const desktop: DesktopLinks = [
    [
        ["/", "Home"],
        ["/competitions", "Competitions"],
        ["/talents", "Talents"],
        ["/talentmakers", "Talentmakers"],
    ],
    [
        ["https://www.youtube.com/channel/UCltJw7oSTdHDio806LztCzQ", "bootstrap", "bi-youtube"],
        ["https://www.linkedin.com/in/talent-maker-group/", "bootstrap", "bi-linkedin"],
        ["https://github.com/Luke-zhang-04/talentmaker-site", "bootstrap", "bi-github"],
        [
            ["/profile", "<USERNAME>"],
            ["/auth", "Sign Up"],
        ],
    ],
]

export default {
    mobile,
    desktop,
}
