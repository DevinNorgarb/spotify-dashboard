import React, { Component } from 'react'
import _ from 'lodash'
import Select from 'react-select'
import 'react-select/dist/react-select.css';

class Playlist extends Component {
	constructor(props) {
		super(props)
		this.state = {
			filter: ""
		}
		this.handleChange = this.handleChange.bind(this)
	}

	handleChange(selected_option) {
		this.setState({filter: selected_option.value})
		console.log(selected_option)
	}

	resetOrder() {
		this.setState({filter: ''})
	}

	render() {
		const { data } = this.props
		const select_options = [
			{ value: 'name:asc', label: 'Name Asc.'},
			{ value: 'name:desc', label: 'Name Desc.'},
			{ value: 'album:asc', label: 'Album Asc.'},
			{ value: 'album:desc', label: 'Album Desc.'},
			{ value: 'artist:asc', label: 'Artist Asc.'},
			{ value: 'artist:desc', label: 'Artist Desc.'},
			{ value: 'added_at:asc', label: 'Added At Asc.'},
			{ value: 'added_at:desc', label: 'Added At Desc.'},
		]
		console.log(data)
		let sorted_tracks = data.tracks
		if (this.state.filter != "")
			sorted_tracks = _.orderBy(data.tracks, ...this.state.filter.split(':'))
		const items = _.map(sorted_tracks, (track) => {
			return <tr><td>{track.name}</td><td>{track.artist}</td><td>{track.album}</td><td>{track.added_at}</td></tr>
		})
		return(
			<div className="playlist-info">
				<h2>{data.name}</h2>
				<form>
					<Select
		        name="form-field-name"
		        value={this.state.filter}
		        onChange={this.handleChange}
		        options={select_options}
		      />
		      <button onClick={this.resetOrder}>Reset Order</button>
				</form>
				<table>
					<tbody>
						<tr><th>Track</th><th>Artist</th><th>Album</th><th>Added On</th></tr>
						{items}
					</tbody>
				</table>
			</div>
		)
	}
}

export default Playlist