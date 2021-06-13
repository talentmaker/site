export type MobileLinks = (
    | [path: string, displayName: string, iconName: string]
    | [
          [path: string, displayName: string, iconName: string],
          [path: string, displayName: string, iconName: string],
      ]
)[]

type DesktopLinkGroup = (
    | [path: string, displayName: string]
    | [[path: string, displayName: string], [path: string, displayName: string]]
)[]

export type DesktopLinks = [left: DesktopLinkGroup, right: DesktopLinkGroup]

export const mobile: MobileLinks = [
    ["/competitions", "view_list", "Competitions"],
    ["/talents", "school", "Talents"],
    ["/", "home", "Home"],
    ["/talentmakers", "cases", "Talentmakers"],
    [
        ["/profile", "account_circle", "Profile"],
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
        [
            ["/profile", "Profile"],
            ["/auth", "Sign Up"],
        ],
    ],
]

export default {
    mobile,
    desktop,
}
