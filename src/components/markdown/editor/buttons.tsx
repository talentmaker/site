/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import React from "react"

export const MarkdownButtons: React.FC<{
    mode: "edit" | "preview"
    setMode: (mode: "edit" | "preview") => void
}> = ({mode, setMode}) => (
    <div className="row bg-lighter mx-0">
        <div className="col-12 d-flex m-0 p-0">
            {mode === "edit" ? (
                <>
                    <button type="button" className="btn py-1 disabled btn-lighter">
                        Edit
                    </button>
                    <button
                        type="button"
                        className="btn py-1 btn-light-grey"
                        onClick={(): void => setMode("preview")}
                    >
                        Preview
                    </button>
                </>
            ) : (
                <>
                    <button
                        type="button"
                        className="btn py-1 btn-light-grey"
                        onClick={(): void => setMode("edit")}
                    >
                        Edit
                    </button>
                    <button type="button" className="btn py-1 disabled btn-lighter border-right-1">
                        Preview
                    </button>
                </>
            )}
        </div>
    </div>
)

export default MarkdownButtons
