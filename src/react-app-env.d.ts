/// <reference types="react-scripts" />

declare module "spdx-license-ids" {
    const licenses: string[]

    export default licenses
}

declare module "osi-licenses" {
    const licenses: {[key: string]: string}

    export default licenses
}

declare type User = import("./schemas/user").CognitoUser
