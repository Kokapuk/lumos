import { Button, Paper, TextField, Typography, useTheme } from '@mui/material';
import styles from './Auth.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useEffect, useState } from 'react';
import axios from '../../utils/axios';

export enum EAuthType {
  SingUp = 'Sign Up',
  SingIn = 'Sign In',
}

interface IProps {
  authType: EAuthType;
}

const Auth = (props: IProps) => {
  const theme = useTheme();
  const [token, setToken] = useAuth();
  const navigate = useNavigate();
  const [invalidReason, setInvalidReason] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  const handleSumbit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(props.authType === EAuthType.SingUp ? '/auth/signup' : '/auth/signin', {
        login: login.trim(),
        password: password.trim(),
      });

      setToken(response.data.token);
    } catch (err: any) {
      console.log(err);
      setInvalidReason(err.response?.data?.message ? err.response.data.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Paper className={styles.paper}>
        <form className={styles.form} onSubmit={handleSumbit}>
          <Typography variant='h6'>{props.authType}</Typography>

          <TextField
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            size='small'
            fullWidth
            type='text'
            label='Login'
            required
          />
          <TextField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size='small'
            fullWidth
            type='password'
            label='Password'
            required
          />
          <Button disabled={isLoading} type='submit' fullWidth variant='contained'>
            {props.authType}
          </Button>

          {props.authType === EAuthType.SingUp ? (
            <Link style={{ color: theme.palette.info.main }} to='/signin'>
              Already have an account?
            </Link>
          ) : (
            <Link style={{ color: theme.palette.info.main }} to='/signup'>
              Don't have an account?
            </Link>
          )}

          {invalidReason && <p style={{ color: theme.palette.error.main }}>{invalidReason}</p>}
        </form>
      </Paper>
    </div>
  );
};

export default Auth;
