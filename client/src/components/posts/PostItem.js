import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatDate';
import { connect } from 'react-redux';
import { toggleLike, deletePost } from '../../actions/post';

const PostItem = ({
  auth,
  toggleLike,
  deletePost,
  post: { _id, text, name, avatar, user, likes, comments, date },
  singlePost,
}) => {
  return (
    <div className='post bg-white p-1 my-1'>
      <div>
        <Link to={`/profile/${user}`}>
          <img className='round-img' src={avatar} alt='' />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className='my-1'>{text}</p>
        <p className='post-date'>Posted on {formatDate(date)}</p>
        {likes.filter((like) => like.user === auth.user._id).length > 0 ? (
          <button
            type='button'
            onClick={() => toggleLike(_id)}
            className='btn btn-liked'
          >
            <i className='fas fa-thumbs-up' /> <span>{likes.length}</span>
          </button>
        ) : (
          <button
            type='button'
            onClick={() => toggleLike(_id)}
            className='btn btn-light'
          >
            <i className='fas fa-thumbs-up' />{' '}
            {likes.length > 0 && <span>{likes.length}</span>}
          </button>
        )}
        {!singlePost && (
          <Link to={`/posts/${_id}`} className='btn btn-primary'>
            Discussion{' '}
            {comments.length > 0 && (
              <span className='comment-count'> {comments.length}</span>
            )}
          </Link>
        )}
        {!auth.loading && user === auth.user._id && (
          <button
            type='button'
            onClick={() => deletePost(_id)}
            className='btn btn-danger'
          >
            <i className='fas fa-times'></i>
          </button>
        )}
      </div>
    </div>
  );
};

PostItem.defaultProps = {
  singlePost: false,
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  toggleLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { toggleLike, deletePost })(PostItem);
