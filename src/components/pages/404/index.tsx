/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import {Button} from "react-bootstrap"
import {Link} from "react-router-dom"
import MaterialIcons from "~/components/materialIcons"
import MetaTags from "~/components/metaTags"
import styles from "./index.module.scss"

export const NotFound = (): JSX.Element => (
    <>
        <div className={`${styles.notFound} d-flex align-items-center justify-content-center`}>
            <section className={styles.errorContainer}>
                <span className={styles.four}>
                    <span className={styles.screenReaderText}>4</span>
                </span>
                <span className={styles.zero}>
                    <span className={styles.screenReaderText}>0</span>
                </span>
                <span className={styles.four}>
                    <span className={styles.screenReaderText}>4</span>
                </span>
            </section>
            <div className={`${styles.linkContainer} d-flex justify-content-center`}>
                {history.length > 1 ? (
                    <Button
                        variant="dark"
                        className="d-block mx-5"
                        onClick={(): void => history.back()}
                    >
                        <MaterialIcons icon="arrow_left" /> Take me back!
                    </Button>
                ) : undefined}
                <Button to="/" variant="primary" as={Link} className="d-block mx-5">
                    <MaterialIcons icon="home" /> Take me home!
                </Button>
            </div>
        </div>
        <MetaTags>
            <meta name="render:status_code" content="404" />
        </MetaTags>
    </>
)

export default NotFound
