/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import {Button, Col, Container} from "react-bootstrap"
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
    bottomFlexMode?: "start" | "end" | "center" | "baseline" | "stretch"
}

export const GridItem: React.FC<Props> = ({
    children,
    desc,
    imageURL,
    link,
    tag,
    title,
    bottomFlexMode = "end",
}) => (
    <Col lg={4} className="my-3">
        <div className={styles.gridCard}>
            <Img src={imageURL ?? DefaultPhoto} alt="cover">
                <Spinner color="primary" size="6rem" centered />
            </Img>
            <div className={styles.cardInfo}>
                {tag && <div className={styles.tag}>{tag}</div>}
                <Container fluid className={styles.cardDetails}>
                    {title && <h3>{title}</h3>}
                    {desc && <p className="text-primary">{desc}</p>}
                    <div
                        className={`d-flex flex-row justify-content-between align-items-${bottomFlexMode}`}
                    >
                        {link && (
                            <Button as={Link} variant="primary" to={link.to}>
                                {link.text}
                            </Button>
                        )}
                        {children}
                    </div>
                </Container>
            </div>
        </div>
    </Col>
)

export default GridItem
