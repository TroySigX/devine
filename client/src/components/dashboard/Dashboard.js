import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';
import { DashboardActions } from './DashboardActions';
import Experience from './Experience';
import Education from './Education';
import { Link } from 'react-router-dom';
import Spinner from '../layout/Spinner';

const Dashboard = ({
  getCurrentProfile,
  auth: { user },
  profile: { profile },
  deleteAccount,
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  return (
    <Fragment>
      {profile === null ? (
        <Spinner />
      ) : (
        <section className='container'>
          <h1 className='large text-primary'>Dashboard</h1>
          <p className='lead'>
            <i className='fas fa-user' /> Welcome {user && user.name}
          </p>
          {profile.created ? (
            <Fragment>
              <DashboardActions />
              {profile.experience.length > 0 && (
                <Experience experience={profile.experience} />
              )}
              {profile.education.length > 0 && (
                <Education education={profile.education} />
              )}

              <div className='my-2'>
                <button className='btn btn-danger' onClick={deleteAccount}>
                  <i className='fas fa-user-minus' /> Delete My Account
                </button>
              </div>
            </Fragment>
          ) : (
            <>
              <p>You have not yet setup a profile, please add some info</p>
              <Link to='/create-profile' className='btn btn-primary my-1'>
                Create Profile
              </Link>
            </>
          )}
        </section>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  deleteAccount: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(
  Dashboard
);
