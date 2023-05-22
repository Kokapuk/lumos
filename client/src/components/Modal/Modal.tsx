import { Box, Modal as MuiModal } from '@mui/material';
import { ReactNode } from 'react';

interface IProps {
  open: boolean;
  onClose?(event: any): void;
  children: ReactNode;
}

const Modal = (props: IProps) => {
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    maxHeight: '100%',
    overflow: 'auto',
  };

  return (
    <MuiModal open={props.open} onClose={props.onClose}>
      <Box sx={style}>{props.children}</Box>
    </MuiModal>
  );
};

export default Modal;
