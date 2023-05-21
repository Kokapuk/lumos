import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
import moment from 'moment';
import styles from './Note.module.scss';

interface IProps {
  text: string;
  color: string;
  timeStamp: number;
  onClick?(): void;
}

const Note = (props: IProps) => {
  return (
    <Card className={styles.note} sx={{ backgroundColor: props.color }}>
      <CardActionArea onClick={props.onClick}>
        <CardContent>
          <Typography variant='body1' color='text.primary'>
            {props.text}
          </Typography>
          <Typography className={styles['note__time-stamp']} variant='body2' color='text.primary'>
            {moment(props.timeStamp).fromNow()}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default Note;
