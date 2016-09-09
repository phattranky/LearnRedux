import React from 'react';
import { Link } from 'react-router';

//Su dung React.cloneElement de append element dong voi tham so this.props.
//Thay vi <PhotoGrid ...this.props />
const Main = React.createClass({
  render() {
    return (
      <div>
        <h1>
          <Link to="/">
            Redux
          </Link>
        </h1>
        {React.cloneElement(this.props.children, this.props)}
      </div>
    )
  }
});

export default Main;