/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import {Button, Col, Row} from "react-bootstrap"
import React from "react"

export const MarkdownButtons: React.FC<{
    mode: "edit" | "preview"
    setMode: (mode: "edit" | "preview") => void
}> = ({mode, setMode}) => (
    <Row className="bg-lighter mx-0">
        <Col xs={12} className="d-flex m-0 p-0">
            {mode === "edit" ? (
                <>
                    <Button variant="lighter" disabled type="button" className="py-1">
                        Edit
                    </Button>
                    <Button
                        type="button"
                        variant="light-grey"
                        className="py-1"
                        onClick={(): void => setMode("preview")}
                    >
                        Preview
                    </Button>
                </>
            ) : (
                <>
                    <Button
                        type="button"
                        variant="light-grey"
                        className="py-1"
                        onClick={(): void => setMode("edit")}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="lighter"
                        disabled
                        type="button"
                        className="py-1 border-right-1"
                    >
                        Preview
                    </Button>
                </>
            )}
        </Col>
    </Row>
)

export default MarkdownButtons
