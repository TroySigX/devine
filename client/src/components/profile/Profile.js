import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useParams, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getProfileById } from '../../actions/profile';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileExperience from './ProfileExperience';
import ProfileEducation from './ProfileEducation';
import ProfileGithub from './ProfileGithub';

const Profile = ({ profile: { profile }, getProfileById, auth }) => {
  const { id } = useParams();
  useEffect(() => {
    getProfileById(id);
  }, [getProfileById, id]);

  return (
    <section className='container'>
      {profile === null ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link to='/profiles' className='btn btn-light'>
            Back To Profiles
          </Link>
          {auth.isAuthenticated &&
            !auth.loading &&
            auth.user._id === profile.user._id && (
              <Link to='/edit-profile' className='btn btn-dark'>
                Edit Profile
              </Link>
            )}
          <div className='profile-grid my-1'>
            <ProfileTop profile={profile} />
            {profile.created && (
              <Fragment>
                <ProfileAbout profile={profile} />
                {profile.experience.length + profile.education.length > 0 && (
                  <Fragment>
                    <div className='profile-exp bg-white p-2'>
                      {profile.experience.length > 0 && (
                        <Fragment>
                          <h2 className='text-primary'>Experience</h2>
                          {profile.experience.map((experience) => (
                            <ProfileExperience
                              key={experience._id}
                              experience={experience}
                            />
                          ))}
                        </Fragment>
                      )}
                      {profile.education.length > 0 && (
                        <Fragment>
                          <h2 className='text-primary'>Education</h2>
                          {profile.education.map((education) => (
                            <ProfileEducation
                              key={education._id}
                              education={education}
                            />
                          ))}
                        </Fragment>
                      )}
                      {profile.githubusername && (
                        <ProfileGithub username={profile.githubusername} />
                      )}
                    </div>
                  </Fragment>
                )}
              </Fragment>
            )}
          </div>
        </Fragment>
      )}
    </section>
  );
};

Profile.propTypes = {
  profile: PropTypes.object.isRequired,
  getProfileById: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, { getProfileById })(Profile);
