import React, { PropTypes } from 'react'
import loadProfileData from '../actions/profile'

class Dashboard extends React.Component {
	constructor(props){
		super(props)
	}

	componentWillMount(){
		this.props.dispatch(loadProfileData())
	}

	render(){
		return (
			<h1> Congrats, it's a dashboard! </h1>
		)
	}
}

export default Dashboard