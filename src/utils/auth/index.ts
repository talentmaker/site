/**
 * Talentmaker website
 *
 * @copyright (C) 2020 Luke Zhang, Ethan Lim
 * @license BSD-3-Clause
 * @author Luke Zhang - luke-zhang-04.github.io
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
 * @returns - Promise with Cognito user
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

export const login = (
    username: string,
    password: string
): void => {
    const authDetails = new AwsCognito.AuthenticationDetails({
            Username: username,
            Password: password,
        }),
        userData = {
            Username: username,
            Pool: userPool
        },
        cognitoUser = new AwsCognito.CognitoUser(userData)

    cognitoUser.authenticateUser(authDetails, {
        onSuccess: (result) => {
            console.log(result)
        },
        onFailure: (err) => {
            console.log(err)
        },
    })
}

export default {
    register,
    login,
}
