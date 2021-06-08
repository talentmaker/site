/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import {Link} from "react-router-dom"
import styles from "./index.module.scss"

export const NotFound = (): JSX.Element => (
    <div className={`${styles.notFound} d-flex align-items-center justify-content-center`}>
        <section className={`${styles.errorContainer}`}>
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
                <button className="btn btn-dark d-block mx-5" onClick={(): void => history.back()}>
                    <span className="material-icons">arrow_left</span> Take me back!
                </button>
            ) : undefined}
            <Link to="/" className="btn btn-primary d-block mx-5">
                <span className="material-icons">home</span> Take me home!
            </Link>
        </div>
    </div>
)

export default NotFound
