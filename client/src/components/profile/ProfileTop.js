import React from 'react';
import PropTypes from 'prop-types';

function displaySocial(social, socialName) {
  const socialIcon = `fab fa-${socialName} fa-2x`;
  return (
    social &&
    social[socialName] && (
      <a href={social[socialName]} target='_blank' rel='noopener noreferrer'>
        <i className={socialIcon}></i>
      </a>
    )
  );
}

const ProfileTop = ({
  profile: {
    status,
    company,
    location,
    website,
    social,
    user: { name, avatar },
  },
}) => {
  return (
    <div className='profile-top bg-primary p-2'>
      <img className='round-img my-1' src={avatar} alt='' />
      <h1 className='large'>{name}</h1>
      <p className='lead'>
        {status} {company && <span>at {company}</span>}
      </p>
      <p>{location && <span>{location}</span>}</p>
      <div className='icons my-1'>
        {website && (
          <a href={website} target='_blank' rel='noopener noreferrer'>
            <i className='fas fa-globe fa-2x'></i>
          </a>
        )}
        {displaySocial(social, 'twitter')}
        {displaySocial(social, 'facebook')}
        {displaySocial(social, 'linkedin')}
        {displaySocial(social, 'youtube')}
        {displaySocial(social, 'instagram')}
      </div>
    </div>
  );
};

ProfileTop.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default ProfileTop;
