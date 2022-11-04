import React from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import { NullUser, User } from "../../patterns/User";

const AdminRoute = ({ component: Component, user, ...rest }) => (
  <Route
    {...rest}
    render={(props) => (!user.isAdmin ? <p>Вам сюда нельзя :)</p> : <Component {...props} />)}
  />
);

const mapStateToProps = (state) => ({
  user: state.auth.user ? new User(state.auth.user) : new NullUser(),
});

export default connect(mapStateToProps)(AdminRoute);
