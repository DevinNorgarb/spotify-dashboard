
export const LOAD_PROFILE_DATA = 'LOAD_PROFILE_DATA';

export function loadProfileData(data) {
	return {
		type: 'LOAD_PROFILE_DATA',
		profile: data
	}
}