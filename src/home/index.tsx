/**
 * Talentmaker website
 * 
 * Copyright (C) 2020 Luke Zhang - Luke-zhang-04.github.io
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import "./home.scss"
import React from "react"

interface HomeState {
    viewport: [number, number],
}

export default class Home extends React.Component<{}, HomeState> {

    public constructor (props: {}) {
        super(props)

        window.onresize = (): void => this.setState({
            viewport: [window.innerWidth, window.innerHeight],
        })

        this.state = {
            viewport: [window.innerWidth, window.innerHeight],
        }
    }

    public render = (): JSX.Element => <></>

}
