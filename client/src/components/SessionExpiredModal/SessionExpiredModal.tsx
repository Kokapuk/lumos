import { Button, Typography } from '@mui/material';
import Modal from '../Modal/Modal';

interface IProps {
  isSessionExpired: boolean;
  setToken(token: string | null): void;
}

const SessionExpiredModal = (props: IProps) => {
  return (
    <Modal open={props.isSessionExpired} onClose={(e: any) => e.preventDefault()}>
      <Typography variant='h6'>Session expired</Typography>
      <Button onClick={() => props.setToken(null)}>Sign In</Button>
    </Modal>
  );
};

export default SessionExpiredModal;
