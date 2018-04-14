import { LOAD_PROFILE_DATA } from '../actions/profile'


const initialState = {
	profileData: { }
}

function reducer(state = initialState, action) {
	switch(action.type) {
		case LOAD_PROFILE_DATA:
			return Object.assign({}, state, {
				profileData: action.profile
			})
		default:
			return state;
	}
}

export default reducer;