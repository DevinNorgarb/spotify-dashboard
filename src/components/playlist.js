import React, { Component } from 'react'
import _ from 'lodash'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import 'whatwg-fetch'

class Playlist extends Component {
	constructor(props) {
		super(props)
		this.state = {
			filter: "",
			sorting: false
		}
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.resetOrder = this.resetOrder.bind(this)
	}

	handleChange(selected_option) {
		this.setState({filter: selected_option.value})	
	}

	resetOrder() {
		this.setState({filter: ''})
	}

	handleSubmit(event) {
		event.preventDefault()
		if(confirm('Are you sure you want to reorder this playlist?  You will not be able to reset the ordering after submitting.')) {
			const { data } = this.props
			const that = this
			that.setState({sorting: true})
			if (this.state.filter != "")
				data.tracks = _.orderBy(data.tracks, ...this.state.filter.split(':'))


			fetch('/playlist', {
				method: 'POST',
				headers: {
			    'Accept': 'application/json',
			    'Content-Type': 'application/json',
			  },
			  body: JSON.stringify(data)
			})
			.then(function(response){
				if(response.status === 200){
					that.setState({sorting: false})
					alert('Sorting complete!')
				}
				else {
					console.log(response)
				}
			})
		}
		else {
			return false
		}
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
		let sorted_tracks = data.tracks
		if (this.state.filter != "")
			sorted_tracks = _.orderBy(data.tracks, ...this.state.filter.split(':'))

		const items = _.map(sorted_tracks, (track, index) => {
			return <tr key={track.name}>
				<td>{index+1}</td>
				<td>{track.name}</td>
				<td>{track.artists.join(', ')}</td>
				<td>{track.album}</td>
				<td>{track.added_at}</td>
			</tr>
		})

		if(this.state.sorting === false){
			return(
					<div className="playlist-info">
						<a href="/dashboard">Back to Dashboard</a>
						<h2>{data.name}</h2>
						<p>Select a sort parameter for the Playlist and press "Submit" to save it.</p>
						<form className="playlist-form" onSubmit={this.handleSubmit}>
							<Select
				        name="form-field-name"
				        value={this.state.filter}
				        onChange={this.handleChange}
				        options={select_options}
				      />
				      <button type="button" onClick={this.resetOrder}>Reset Order</button>
				      <button type="submit" onClick={this.handleSubmit}>Submit</button>
						</form>
						<table className="playlist-detail-table">
							<tbody>
								<tr key="headers">
									<th></th>
									<th>Track</th>
									<th>Artist</th>
									<th>Album</th>
									<th>Added On</th>
								</tr>
								{items}
							</tbody>
						</table>
					</div>
				)
			}
			else{
				return <p> Sorting playlist... please wait, this may take a few minutes...</p>
			}
	}
}

export default Playlist