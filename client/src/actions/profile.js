import api from '../utils/api';
import { setAlert } from './alert';
import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  CLEAR_PROFILE,
  ACCOUNT_DELETE,
  GET_REPOS,
  NO_REPOS,
} from './types';

/** Get user current profile */
export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await api.get('/profile/me');

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get all profiles
export const getProfiles = () => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });

  try {
    const res = await api.get('/profile');

    // prioritize profiles which are created
    res.data.sort(
      (profile1, profile2) =>
        Number(profile2.created) - Number(profile1.created)
    );

    dispatch({
      type: GET_PROFILES,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get profile by ID
export const getProfileById = (userId) => async (dispatch) => {
  try {
    const res = await api.get(`/profile/user/${userId}`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get Github repos
export const getGithubRepos = (username) => async (dispatch) => {
  try {
    const res = await api.get(`/profile/github/${username}`);

    dispatch({
      type: GET_REPOS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: NO_REPOS,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Create/update profile
export const createProfile =
  (formData, edit = false) =>
  async (dispatch) => {
    try {
      const res = await api.post('/profile', formData);

      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      });

      dispatch(
        setAlert('Profile ' + (edit ? 'Updated' : 'Created'), 'success')
      );

      return res.data;
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }

      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };

// add experience
export const addExperience = (formData) => async (dispatch) => {
  try {
    const res = await api.put('/profile/experience', formData);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert('Experience Added', 'success'));

    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// delete experience
export const deleteExperience = (id) => async (dispatch) => {
  try {
    const res = await api.delete(`/profile/experience/${id}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert('Experience Removed', 'success'));

    return res.data;
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// add education
export const addEducation = (formData) => async (dispatch) => {
  try {
    const res = await api.put('/profile/education', formData);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert('Education Added', 'success'));

    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// delete education
export const deleteEducation = (id) => async (dispatch) => {
  try {
    const res = await api.delete(`/profile/education/${id}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert('Program Removed', 'success'));

    return res.data;
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// delete account
export const deleteAccount = () => async (dispatch) => {
  if (!window.confirm('Are you sure? This cannot be undone!')) {
    return;
  }

  try {
    const res = await api.delete(`/profile`);

    dispatch({ type: CLEAR_PROFILE });
    dispatch({ type: ACCOUNT_DELETE });

    dispatch(setAlert('Your account has been deleted'));

    return res.data;
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
