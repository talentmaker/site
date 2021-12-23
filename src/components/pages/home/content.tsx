/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import "swiper/swiper.scss"
import {Col, Container, Row} from "react-bootstrap"
import {Swiper, SwiperSlide} from "swiper/react/swiper-react"
import SwiperCore, {Autoplay} from "swiper"
import {BreakPoints} from "~/globals"
import {ContactForm} from "./contactForm"
import ContactImage from "~/images/contact.svg"
import Img from "~/components/elements/image"
import {Link} from "react-router-dom"
import LogoCommunitySupportConnections from "~/images/companies/csc.svg"
import LogoFood4Kids from "~/images/companies/food4kids.png"
import LogoKkCabinets from "~/images/companies/kkcabinets.svg"
import LogoWISS from "~/images/companies/wiss.png"
import React from "react"
import SponsorSvg from "~/images/sponsor.svg"
import TeamworkSvg from "~/images/teamwork.svg"
import styles from "./home.module.scss"
import {useWindowSize} from "~/hooks"

SwiperCore.use([Autoplay])

const anchorClassname = "text-center d-block w-100 bg-lighter p-2 fs-8 fs-md-6"

export const Content: React.FC = () => {
    const [width] = useWindowSize()

    return (
        <>
            <Row className={`${styles.row2} align-items-center`}>
                <Col md={4}>
                    <Img lazy alt="teamwork" src={TeamworkSvg} className="w-100 ps-3">
                        <Img.DefaultSpinner />
                    </Img>
                </Col>
                <Col md={8} className={`text ${styles.text}`}>
                    <h2>Why Talentmaker?</h2>
                    <p>
                        Real, hands on project experience for real companies to get your career
                        started. Create meaningful and functional applications and work as a team
                        &mdash; whether you&apos;re an aspiring developer, designer, or business
                        analyst, everyone has a role to play in the creation of a successful
                        project.
                    </p>
                </Col>
            </Row>
            <Row className={`${styles.row} align-items-center flex-column-reverse flex-md-row`}>
                <Col md={8} className={`text ${styles.text}`}>
                    <h2>Sponsor the Next Generation</h2>
                    <p>
                        Need a project done? Help empower the next generation of engineers,
                        computer scientists, designers, and businesspeople acheive their goals by
                        giving them the opportunity to work on a project for you. Using our
                        platform, you can get fulfill your needs while helping students fulfill
                        theirs.
                    </p>
                </Col>
                <Col md={4}>
                    <Img lazy alt="sponsor" src={SponsorSvg} className="w-100 pe-3">
                        <Img.DefaultSpinner />
                    </Img>
                </Col>
            </Row>
            <div className="my-5">
                <h2 className="text-center mb-4">We&apos;re proud to have worked with:</h2>
                <Swiper
                    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                    spaceBetween={width >= BreakPoints.Md ? 75 : 10}
                    slidesPerView={width >= BreakPoints.Md ? 3 : 2}
                    loop
                    className="px-5"
                    autoplay={{delay: 3000}}
                    grabCursor
                    centeredSlides
                >
                    <SwiperSlide>
                        <div className="bg-lighter">
                            <Link to="competition/4">
                                <Img
                                    className={`w-100 ${styles.slideImage}`}
                                    lazy
                                    src={LogoCommunitySupportConnections}
                                    alt="LogoCommunitySupportConnections"
                                >
                                    <Img.DefaultSpinner />
                                </Img>
                            </Link>
                        </div>
                        <Link to="competition/4" className={anchorClassname}>
                            Community Support Connections
                        </Link>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="bg-lighter">
                            <Link to="competition/2">
                                <Img
                                    className={`w-100 ${styles.slideImage}`}
                                    lazy
                                    src={LogoFood4Kids}
                                    alt="LogoFood4Kids"
                                >
                                    <Img.DefaultSpinner />
                                </Img>
                            </Link>
                        </div>
                        <Link to="competition/2" className={anchorClassname}>
                            Food4Kids Waterloo Region
                        </Link>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="bg-lighter">
                            <a
                                href="https://kkcabinets.ca/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Img
                                    className={`w-100 ${styles.slideImage}`}
                                    lazy
                                    src={LogoKkCabinets}
                                    alt="LogoKkCabinets"
                                >
                                    <Img.DefaultSpinner />
                                </Img>
                            </a>
                        </div>
                        <a
                            href="https://kkcabinets.ca/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={anchorClassname}
                        >
                            KK Cabinets
                        </a>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="bg-lighter">
                            <Link to="/competition/1">
                                <Img
                                    className={`w-100 ${styles.slideImage}`}
                                    lazy
                                    src={LogoWISS}
                                    alt="LogoWISS"
                                >
                                    <Img.DefaultSpinner />
                                </Img>
                            </Link>
                        </div>
                        <Link to="/competition/1" className={anchorClassname}>
                            Waterloo Ind. Secondary School
                        </Link>
                    </SwiperSlide>
                </Swiper>
            </div>
            <Row className="my-5">
                <Col
                    xs={12}
                    md={6}
                    className="text-center bg-lighter p-3 p-md-5 align-items-center justify-content-center d-flex col-md-6 col-12"
                >
                    <Container fluid>
                        <h2>Get in Touch</h2>
                        <ContactForm />
                        <small>
                            Or email us at{" "}
                            <a
                                href="mailto:talentmakergroup@gmail.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                talentmakergroup@gmail.com
                            </a>
                        </small>
                    </Container>
                </Col>
                <Col
                    xs={12}
                    md={6}
                    className="bg-primary align-items-center justify-content-center d-flex py-5"
                >
                    <Container fluid className="gx-5 text-center">
                        <Img className="w-75 flex-center" lazy src={ContactImage} alt="Contact us">
                            <Img.DefaultSpinner />
                        </Img>
                    </Container>
                </Col>
            </Row>
        </>
    )
}

export default Content
