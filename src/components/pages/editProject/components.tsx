/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import {Input} from "~/components/formik"

const sharedProps = {
    shouldShowValidFeedback: false,
    className: "bg-lighter",
}

export const TopFields = (): JSX.Element => (
    <>
        <Input
            {...sharedProps}
            name="name"
            type="text"
            label="Submission Title"
            placeholder="Submission Title"
        >
            <span className="material-icons">sort</span>
        </Input>
    </>
)

export const BottomFields = (): JSX.Element => (
    <>
        <Input
            {...sharedProps}
            name="srcURL"
            type="url"
            label="Source Code URL"
            placeholder="Source Code URL"
        >
            <span className="material-icons">code</span>
        </Input>
        <Input {...sharedProps} name="demoURL" type="url" label="Demo URL" placeholder="Demo URL">
            <span className="material-icons">preview</span>
        </Input>
        <Input
            {...sharedProps}
            name="license"
            type="text"
            label="License"
            placeholder="SPDX License ID or URL to a custom license"
        >
            <span className="material-icons">gavel</span>
        </Input>
        <Input
            {...sharedProps}
            name="videoURL"
            type="url"
            label="Video URL"
            placeholder="Video URL"
        >
            <span className="material-icons">video_library</span>
        </Input>
    </>
)
