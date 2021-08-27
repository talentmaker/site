/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
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
            label="Competition Title"
            placeholder="Competition Title"
        >
            <span className="material-icons">sort</span>
        </Input>
        <Input
            {...sharedProps}
            name="shortDesc"
            type="text"
            label="Short Description"
            placeholder="Short Description"
        >
            <span className="material-icons">description</span>
        </Input>
        <Input {...sharedProps} name="deadline" type="date" label="Deadline">
            <span className="material-icons">event</span>
        </Input>
    </>
)

export const BottomFields = (): JSX.Element => (
    <>
        <Input
            {...sharedProps}
            name="videoURL"
            type="url"
            label="Video URL"
            placeholder="Video URL"
        >
            <span className="material-icons">video_library</span>
        </Input>
        <Input
            {...sharedProps}
            name="website"
            type="url"
            label="Website URL"
            placeholder="Website URL"
        >
            <span className="material-icons">language</span>
        </Input>
        <Input
            {...sharedProps}
            name="coverImageURL"
            type="url"
            label="Cover Image URL"
            placeholder="Cover Image URL"
        >
            <span className="material-icons">insert_photo</span>
        </Input>
    </>
)
