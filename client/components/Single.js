import React from 'react';
import { Link } from 'react-router';
import Photo from './Photo';
import Comment from './Comment';

const Single = React.createClass({
  render() {
    
    const { postId } = this.props.params;
    
    //index of the post
    const i = this.props.posts.findIndex((post) => post.code === postId);
    const post = this.props.posts[i];
    const postComments = this.props.comments[postId] || [];
    
    return (
      <div className="single-photo">
        <Photo index={i} post={post} {...this.props} />
        <Comment postComments = {postComments} {...this.props} />
      </div>
    )
  }
});

export default Single;