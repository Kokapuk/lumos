import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
import moment from 'moment';
import styles from './Note.module.scss';
import { INoteData } from '../../types';

interface IProps {
  noteData: INoteData;
  onClick?(): void;
}

const Note = (props: IProps) => {
  return (
    <Card
      className={styles.note}
      sx={{
        backgroundColor: props.noteData.color,
        height: 'min-content',
        textDecoration: props.noteData.completed ? 'line-through' : 'none',
      }}>
      <CardActionArea onClick={props.onClick}>
        <CardContent>
          <Typography style={{ whiteSpace: 'pre-line' }} variant='body1' color='text.primary'>
            {props.noteData.text}
          </Typography>
          <Typography className={styles['note__time-stamp']} variant='body2' color='text.primary'>
            {moment(props.noteData.timeStamp).fromNow()}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default Note;
