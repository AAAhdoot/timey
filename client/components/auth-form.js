import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { auth } from '../store';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  dense: {
    marginTop: 16
  },
  menu: {
    width: 200
  }
});

const AuthForm = props => {
  const { name, displayName, handleSubmit, error, classes } = props;

  return (
    <div id="loginform">
      <form
        id="loginForm1"
        className={classes.container}
        onSubmit={handleSubmit}
        name={name}
      >
        {/* I am saving the old formfields until these pass testing  */}
        {/* <div>
          <label htmlFor="email">
            <small>Email</small>
          </label>
          <input name="email" type="text" />
        </div>
        <div>
          <label htmlFor="password">
            <small>Password</small>
          </label>
          <input name="password" type="password" />
        </div>
        <div>
          <button type="submit">{displayName}</button>
        </div> */}
        <div>
          {' '}
          <TextField
            required
            id="outlined-with-placeholder"
            label="Email"
            placeholder="Email"
            margin="normal"
            variant="outlined"
            input="email"
            type="email"
            name="email"
          />
        </div>
        <div>
          <TextField
            required
            id="outlined-password-input"
            label="Password"
            type="password"
            className={classes.textField}
            name="password"
            margin="normal"
            variant="outlined"
          />
        </div>
        <div>
          <Button type="submit" variant="outlined" className={classes.button}>
            {displayName}
          </Button>
        </div>
        {error && error.response && <div> {error.response.data} </div>}
        {/* <div> <form method='get' action='/auth/google'>
      <button type='submit'  className="loginBtn loginBtn--google">Login with Google</button>
    </form></div> */}
      </form>

      {/* Commenting out google OAuth until its implemented  */}
      {/* <a href="/auth/google">{displayName} with Google</a> */}
      <form method="get" action="/auth/google">
        <button type="submit" className="loginBtn loginBtn--google">
          {name === 'login' ? 'Login with Google' : 'Sign Up with Google'}
        </button>
      </form>
    </div>
  );
};

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = state => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error
  };
};

const mapSignup = state => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error
  };
};

const mapDispatch = dispatch => {
  return {
    handleSubmit(evt) {
      evt.preventDefault();
      const formName = evt.target.name;
      const email = evt.target.email.value;
      const password = evt.target.password.value;
      dispatch(auth(email, password, formName));
    }
  };
};

export const Login = connect(
  mapLogin,
  mapDispatch
)(withStyles(styles)(AuthForm));
export const Signup = connect(
  mapSignup,
  mapDispatch
)(withStyles(styles)(AuthForm));

/**
 * PROP TYPES
 */
AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object,
  classes: PropTypes.object.isRequired
};
