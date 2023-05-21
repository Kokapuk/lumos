import { Button, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import Modal from '../Modal/Modal';
import Note from '../Note/Note';
import { INote } from '../../types';

interface IProps {
  open: boolean;
  editing?: INote | null;
  onClose?(): void;
  onSave(text: string, timeStamp: number, color: string): void;
  onDelete(_id: string): void;
}

const EditNoteModal = (props: IProps) => {
  const generateRandomHexColor = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  };

  const [text, setText] = useState('');
  const [dateTime, setDateTime] = useState(dayjs());
  const [color, setColor] = useState(generateRandomHexColor());

  const handleSaveClick = () => {
    if (text.trim() === '') {
      return;
    }

    props.onSave(text, dateTime.valueOf(), color);
  };

  useEffect(() => {
    if (!props.open || !props.editing) {
      setText('');
      setDateTime(dayjs());
      return setColor(generateRandomHexColor());
    }

    setText(props.editing.text);
    setDateTime(dayjs(props.editing.timeStamp));
    setColor(props.editing.color);
  }, [props.open]);

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Typography variant='h6'>Edit note</Typography>
      <TextField value={text} onChange={(e) => setText(e.target.value)} size='small' label='Text' />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker value={dateTime} onChange={(value) => setDateTime(value!)} format='DD.MM.YYYY' />
        <TimePicker value={dateTime} onChange={(value) => setDateTime(value!)} ampm={false} />
      </LocalizationProvider>
      <input type='color' value={color} onChange={(e) => setColor(e.currentTarget.value)} />
      <Note text={text} timeStamp={dateTime.valueOf()} color={color} />
      <Button onClick={handleSaveClick} color='success' variant='contained'>
        Save
      </Button>
      {props.editing && (
        <Button onClick={() => props.onDelete(props.editing!._id)} color='error' variant='contained'>
          Delete
        </Button>
      )}
    </Modal>
  );
};

export default EditNoteModal;
