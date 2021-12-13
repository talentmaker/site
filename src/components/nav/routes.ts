import type {ButtonVariant} from "react-bootstrap/esm/types"

export type MobileLinks = (
    | [path: string, displayName: string, iconName: string]
    | [
          authenticated:
              | [path: string, displayName: string, iconName: string]
              | [path: string, displayName: string, iconName: string][],
          unauthenticated:
              | [path: string, displayName: string, iconName: string]
              | [path: string, displayName: string, iconName: string][],
      ]
)[]

type DesktopLinkGroup = (
    | [path: string, displayName: string]
    | [href: string, iconType: "bootstrap" | "material-icons", iconName: string]
    | [
          authenticated:
              | [path: string, displayName: string, buttonVariant?: ButtonVariant]
              | [path: string, displayName: string, buttonVariant?: ButtonVariant][],
          unauthenticated:
              | [path: string, displayName: string, buttonVariant?: ButtonVariant]
              | [path: string, displayName: string, buttonVariant?: ButtonVariant][],
      ]
)[]

export type DesktopLinks = [left: DesktopLinkGroup, right: DesktopLinkGroup]

export const mobile: MobileLinks = [
    ["/competitions", "view_list", "Competitions"],
    ["/talents", "school", "Talents"],
    ["/", "home", "Home"],
    ["/talentmakers", "cases", "Talentmakers"],
    [
        ["/profile/<UID>", "account_circle", "<USERNAME>"],
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
            ["/profile/<UID>", "<USERNAME>"],
            [
                ["/auth?mode=login", "Sign In"],
                ["/auth?mode=register", "Sign Up", "outline-primary"],
            ],
        ],
    ],
]

export default {
    mobile,
    desktop,
}
