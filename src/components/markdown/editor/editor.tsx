import {Props, RenderMarkdown} from ".."
import {highlight, languages} from "prismjs"
import {Button} from "react-bootstrap"
import Editor from "@luke-zhang-04/react-simple-markdown-editor"
import React from "react"
import styles from "~/components/markdown/styles.module.scss"

type EditableMarkdownProps = {
    onSave?: (data: string) => void
    onCancel?: (data: string) => void

    /**
     * Run on change. Performance isn't an issue as the markdown renderer only runs when needed
     */
    onChange?: (data: string) => void
    isEditing?: boolean
    canEdit?: boolean

    /**
     * If a warning message should be shown to alert to unsaved changes
     */
    hasWarningMessage?: boolean
}

export const EditableMarkdown = ({
    canEdit,
    hasWarningMessage,
    ...props
}: Props & EditableMarkdownProps): ReturnType<React.FC> => {
    const [isEditing, setIsEditing] = React.useState(props.isEditing ?? false)
    const [value, setValue] = React.useState(props.children)
    const originalValue = React.useRef<string>()

    React.useEffect(() => {
        originalValue.current = props.children
    }, [])

    React.useEffect(() => {
        if (props.isEditing !== undefined) {
            setIsEditing(props.isEditing)
        }
    }, [props.isEditing])

    const button = isEditing ? (
        <Button variant="outline-dark" onClick={() => setIsEditing(false)}>
            <span className="material-icons">visibility</span>
        </Button>
    ) : (
        <Button variant="outline-dark" onClick={() => setIsEditing(true)}>
            <span className="material-icons">create</span>
        </Button>
    )

    if (canEdit) {
        return (
            <>
                <div className="d-flex flex-row justify-content-end">{button}</div>
                {isEditing ? (
                    <>
                        <Editor
                            value={value}
                            onValueChange={(code) => {
                                setValue(code)
                                props.onChange?.(code)
                            }}
                            highlight={(code) => highlight(code, languages.markdown, "markdown")}
                            className="form-control bg-transparent"
                            preClassName={styles.editorPre}
                            padding={3}
                            shouldAutoFocus
                        />
                        <div className="d-flex flex-row justify-content-end">
                            <Button
                                variant="outline-danger"
                                onClick={() => {
                                    const newValue = originalValue.current ?? ""

                                    setValue(newValue)
                                    props.onCancel?.(newValue)
                                    props.onChange?.(newValue)
                                    setIsEditing(false)
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="success"
                                className="ms-3"
                                onClick={() => {
                                    props.onSave?.(value)
                                    setIsEditing(false)
                                }}
                            >
                                Save
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        {hasWarningMessage && (
                            <>
                                <p className="text-danger">Warning: you have unsaved changes.</p>
                                <div className="d-flex flex-row justify-content-start">
                                    <div>
                                        <Button
                                            variant="outline-danger"
                                            onClick={() => {
                                                const newValue = originalValue.current ?? ""

                                                setValue(newValue)
                                                props.onCancel?.(newValue)
                                                props.onChange?.(newValue)
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="success"
                                            className="ms-3"
                                            onClick={() => props.onSave?.(value)}
                                        >
                                            Save
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                        <RenderMarkdown {...props}>{value}</RenderMarkdown>
                    </>
                )}
            </>
        )
    }

    return <RenderMarkdown {...props} />
}
