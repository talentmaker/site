/**
 * Talentmaker website
 *
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 * @author Luke Zhang
 *
 * @license BSD-3-Clause
 */

import "./index.scss"
import {Link} from "react-router-dom"
import React from "react"

export const NotFound = (): JSX.Element => <div className="notFound d-flex align-items-center justify-content-center">
    <section className="error-container">
        <span className="four"><span className="screen-reader-text">4</span></span>
        <span className="zero"><span className="screen-reader-text">0</span></span>
        <span className="four"><span className="screen-reader-text">4</span></span>
    </section>
    <div className="link-container d-flex justify-content-center">
        {
            history.length > 1
                ? <button className="btn btn-dark d-block mx-5" onClick={(): void => history.back()}>
                    <span className="material-icons">arrow_left</span> Take me back!
                </button>
                : undefined
        }
        <Link to="/" className="btn btn-primary d-block mx-5">
            <span className="material-icons">home</span> Take me home!
        </Link>
    </div>
</div>

export default NotFound
