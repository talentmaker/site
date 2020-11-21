/**
 * Talentmaker website
 *
 * @copyright (C) 2020 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 * @author Luke Zhang
 *
 * @license BSD-3-Clause
 */
/* eslint-disable @typescript-eslint/naming-convention */

import * as AwsCognito from "amazon-cognito-identity-js"

const poolData = {
        UserPoolId: "us-east-1_6ovwzlvIj",
        ClientId: "kp3st63fo709fr67sioh0edie",
    },
    userPool = new AwsCognito.CognitoUserPool(poolData)

/**
 * Register a user. Promise based 😀
 * @param username - username
 * @param email - email
 * @param password - password
 * @returns promise with Cognito user
 */
export const register = (
    username: string,
    email: string,
    password: string,
): Promise<AwsCognito.CognitoUser> => {
    const attributeList = [
        new AwsCognito.CognitoUserAttribute({
            Name: "name",
            Value: username,
        }),
        new AwsCognito.CognitoUserAttribute({
            Name: "email",
            Value: email,
        }),
    ]

    return new Promise((resolve, reject) => {
        userPool.signUp(username, password, attributeList, [], (err, result) => {
            if (err) {
                reject(err)
            }

            resolve(result?.user)
        })
    })
}

/**
 * Log a user in. Promise based 😀
 * @param username - username
 * @param password - password
 * @returns promise with Cognito user
 */
export const login = (
    username: string,
    password: string
): Promise<AwsCognito.CognitoUserSession> => {
    const authDetails = new AwsCognito.AuthenticationDetails({
            Username: username,
            Password: password,
        }),
        userData = {
            Username: username,
            Email: username,
            Pool: userPool
        },
        cognitoUser = new AwsCognito.CognitoUser(userData)

    return new Promise((resolve, reject) => {
        cognitoUser.authenticateUser(authDetails, {
            onSuccess: (result) => {
                console.log(result)
                resolve(result)
            },
            onFailure: (err) => {
                console.log(err)
                reject(err)
            },
        })
    })
}

/**
 * Get the current user
 */
export const {getCurrentUser} = userPool

/**
 * Logs a user out
 * @param strict - if an error should be thrown on null user
 * @returns - error if strict, otherwise void
 */
export const logout = (strict = true): void | Error => {
    const user = getCurrentUser()

    if (strict && !user) {
        return new Error("User is null")
    } else if (user) {
        return user.signOut()
    }

    return undefined
}

export default {
    register,
    login,
}
