import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteComment, editComment } from '../../actions/post';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatDate';

const CommentItem = ({
  postId,
  comment: { _id, text, name, avatar, user, date },
  auth,
  deleteComment,
  editComment,
}) => {
  const [edit, setEdit] = useState(false);
  const [showDeleteText, setShowDeleteText] = useState(false);
  const [editCancelText, setEditCancelText] = useState(false);
  const [commentText, setCommentText] = useState(''); // edit comment text

  return (
    <div className='post bg-white p-1 my-1'>
      <div>
        <Link to={`/profile/${user}`}>
          <img className='round-img' src={avatar} alt='' />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        {edit ? (
          <Fragment>
            <form
              className='form my-1'
              onSubmit={(e) => {
                e.preventDefault();
                editComment(postId, _id, { text: commentText });
                setEdit(false);
              }}
            >
              {/* TODO: count line wrap */}
              <textarea
                name='text'
                cols='30'
                id='content'
                className='wrapper'
                rows=''
                style={{ overflowWrap: 'break-word' }}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
              ></textarea>
              <input
                type='submit'
                className='btn btn-dark my-1'
                value='Submit'
              />
              <button
                type='button'
                style={{
                  width: '115px',
                }}
                className='btn btn-danger'
                onMouseEnter={() => setEditCancelText(true)}
                onMouseLeave={() => setEditCancelText(false)}
                onClick={() => setEdit(false)}
              >
                {editCancelText ? 'Cancel' : <i className='fas fa-times' />}
              </button>
            </form>
          </Fragment>
        ) : (
          <Fragment>
            <p
              className='my-1'
              style={{ whiteSpace: 'pre-wrap', 'word-break': 'break-word' }}
            >
              {text}
            </p>
            <p className='post-date'>Posted on {formatDate(date)}</p>
            {!auth.loading && user === auth.user._id && (
              <Fragment>
                <button
                  type='button'
                  style={{
                    width: '115px',
                  }}
                  className='btn btn-light'
                  onClick={() => {
                    setCommentText(text);
                    setEditCancelText(false);
                    setEdit(true);
                  }}
                >
                  Edit
                </button>
                <button
                  type='button'
                  style={{
                    width: '115px',
                  }}
                  className='btn btn-danger'
                  onMouseEnter={() => setShowDeleteText(true)}
                  onMouseLeave={() => setShowDeleteText(false)}
                  onClick={() => deleteComment(postId, _id)}
                >
                  {showDeleteText ? 'Delete' : <i className='fas fa-times'></i>}
                </button>
              </Fragment>
            )}
          </Fragment>
        )}
      </div>
    </div>
  );
};

CommentItem.propTypes = {
  postId: PropTypes.string.isRequired,
  comment: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired,
  editComment: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { editComment, deleteComment })(
  CommentItem
);
