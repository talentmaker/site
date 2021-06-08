/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import DefaultPhoto from "~/images/default.svg"
import {Img} from "../elements"
import {Link} from "react-router-dom"
import React from "react"
import {Spinner} from "../bootstrap"
import styles from "./index.module.scss"

type Props = {
    imageURL?: string
    desc?: string
    link?: {
        to: string
        text: string
    }
    tag?: string
    title?: string
}

export const GridItem: React.FC<Props> = ({children, desc, imageURL, link, tag, title}) => (
    <div className="col-lg-4 my-3">
        <div className={`${styles.gridCard}`}>
            <Img src={imageURL ?? DefaultPhoto} alt="cover">
                <Spinner color="primary" size="6rem" centered />
            </Img>
            <div className={`${styles.cardInfo}`}>
                {tag ? <div className={`${styles.tag}`}>{tag}</div> : undefined}
                <div className={`container-fluid ${styles.cardDetails}`}>
                    {title ? <h3>{title}</h3> : undefined}
                    {desc ? <p className="text-primary">{desc}</p> : undefined}
                    {link ? (
                        <Link to={link.to} className="btn btn-outline-primary">
                            {link.text}
                        </Link>
                    ) : undefined}
                    {children}
                </div>
            </div>
        </div>
    </div>
)

export default GridItem
