/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import {Col, Container, Row} from "react-bootstrap"
import React, {ReactNode} from "react"
import {IFrame} from "../elements"
import {Link} from "react-router-dom"
import {Spinner} from "../bootstrap"
import styles from "./index.module.scss"

type UserInfoProps = {
    username?: string
    desc?: string
}

export const UserInfo: React.FC<UserInfoProps> = ({username, desc, children}) => (
    <Container fluid>
        <Row className="mb-gy">
            {children ? (
                <>
                    <Col lg={7} className="d-flex flex-column justify-content-center">
                        {username && <p className={styles.username}>{username}</p>}
                        {desc && <p className="sub text-muted mb-0">{desc}</p>}
                    </Col>
                    <Col lg={5} className="d-flex flex-row align-items-center justify-content-end">
                        {children}
                    </Col>
                </>
            ) : (
                <Col lg={12} className="d-flex flex-column justify-content-center">
                    {username && <p className={styles.username}>{username}</p>}
                    {desc && <p className="sub text-muted mb-0">{desc}</p>}
                </Col>
            )}
        </Row>
    </Container>
)

export const Video: React.FC<React.ComponentProps<typeof IFrame>> = (props) => {
    const [didVideoLoad, setLoad] = React.useState(false)

    return (
        <div className="mx-gx mt-3">
            <div className={`${styles.videoContainer} ${didVideoLoad ? "" : "p-0"}`}>
                <IFrame
                    {...props}
                    title={props.title ?? "video"}
                    className={`${styles.video} ${props.className}`}
                    onLoad={(event): void => {
                        setLoad(true)

                        props.onLoad?.(event)
                    }} // Change state to add padding
                    onError={(event): void => {
                        setLoad(true)

                        props.onError?.(event)
                    }}
                >
                    <Spinner color="danger" size="25vw" className="my-5" centered />
                </IFrame>
            </div>
        </div>
    )
}

type SidebarProps = {
    items: (
        | {title: string; icon?: undefined; contents: ReactNode; href?: string; to?: undefined}
        | {icon: string; title?: undefined; contents: ReactNode; href?: string; to?: undefined}
        | {title: string; icon?: undefined; contents: ReactNode; to?: string; href?: undefined}
        | {icon: string; title?: undefined; contents: ReactNode; to?: string; href?: undefined}
        | undefined
    )[]
}

const linkProps = {
    target: "_blank",
    rel: "noopener noreferrer",
    className: "text-decoration-none mb-3 d-block",
}

const SidebarItem: React.FC<SidebarProps["items"][0]> = ({icon, title, contents, to, href}) => {
    if (icon) {
        if (to) {
            return (
                <Link className={linkProps.className} to={to}>
                    <span className="material-icons">{icon}</span> {contents}
                </Link>
            )
        } else if (href) {
            return (
                <a {...linkProps} href={href}>
                    <span className="material-icons">{icon}</span> {contents}
                </a>
            )
        }

        return (
            <p>
                <span className="material-icons">{icon}</span> {contents}
            </p>
        )
    }

    if (to) {
        return (
            <p>
                <b>{title}</b>
                <Link className={linkProps.className} to={to}>
                    {contents}
                </Link>
            </p>
        )
    } else if (href) {
        return (
            <p>
                <b>{title}</b>
                <a {...linkProps} href={href}>
                    {contents}
                </a>
            </p>
        )
    }

    return (
        <p>
            <b>{title}</b>
            {contents}
        </p>
    )
}

export const Sidebar: React.FC<SidebarProps> = ({items}) => (
    <div className="p-3 position-sticky top-0">
        <button
            className="btn-circle"
            onClick={(): void => {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                })
            }}
        >
            <span className="material-icons">expand_less</span>
        </button>
        <h1>About</h1>
        <ul className="list-unstyled text-dark">
            {items.map((item, index) =>
                item ? <SidebarItem {...item} key={`sidebaritem-${index}`} /> : undefined,
            )}
        </ul>
    </div>
)

export const Bar: React.FC<{topics?: (string | undefined)[] | null}> = ({topics}) => (
    <Row className={`bg-primary ${styles.bar}`}>
        <Col xs={12} className={styles.topics}>
            {" "}
            {/* Blue bar with competitions */}
            {topics?.map((topic, index) => (
                <p
                    className="bg-primary mx-1 my-0 py-1 px-2 d-flex"
                    key={`topic-${topic}-${index}`}
                >
                    {topic}
                </p>
            ))}
        </Col>
    </Row>
)
