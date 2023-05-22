import { Button, FormControlLabel, Switch, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import Modal from '../Modal/Modal';
import Note from '../Note/Note';
import { INote, INoteData } from '../../types';

interface IProps {
  open: boolean;
  editing?: INote | null;
  onClose?(): void;
  onSave(noteData: INoteData): void;
  onDelete(_id: string): void;
}

const EditNoteModal = (props: IProps) => {
  const generateRandomHexColor = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  };

  const initialNoteData: INoteData = {
    text: '',
    timeStamp: Date.now(),
    completed: false,
    color: generateRandomHexColor(),
  };

  const [noteData, setNoteData] = useState(initialNoteData);
  const [isLoading, setLoading] = useState(false);

  const handleSaveClick = () => {
    if (noteData.text.trim() === '') {
      return;
    }

    setLoading(true);
    props.onSave(noteData);
  };

  const handleDeleteClick = () => {
    setLoading(true);
    props.onDelete(props.editing!._id);
  };

  useEffect(() => {
    if (!props.open || !props.editing) {
      setNoteData(initialNoteData);
      return setLoading(false);
    }

    setNoteData(props.editing);
    setLoading(false);
  }, [props.open]);

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Typography variant='h6'>Edit note</Typography>
      <TextField
        multiline
        autoComplete='off'
        value={noteData.text}
        onChange={(e) => setNoteData((prev) => ({ ...prev, text: e.target.value }))}
        size='small'
        label='Text'
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          value={dayjs(noteData.timeStamp)}
          onChange={(value) => setNoteData((prev) => ({ ...prev, timeStamp: value!.valueOf() }))}
          format='DD.MM.YYYY'
        />
        <TimePicker
          value={dayjs(noteData.timeStamp)}
          onChange={(value) => setNoteData((prev) => ({ ...prev, timeStamp: value!.valueOf() }))}
          ampm={false}
        />
      </LocalizationProvider>
      <FormControlLabel
        control={
          <Switch
            checked={noteData.completed}
            onChange={(e) => setNoteData((prev) => ({ ...prev, completed: e.target.checked }))}
          />
        }
        label='Completed'
      />
      <input type='color' value={noteData.color} onChange={(e) => setNoteData((prev) => ({ ...prev, color: e.target.value }))} />
      <Note noteData={noteData} />
      <Button disabled={isLoading} onClick={handleSaveClick} color='success' variant='contained'>
        Save
      </Button>
      {props.editing && (
        <Button disabled={isLoading} onClick={handleDeleteClick} color='error' variant='contained'>
          Delete
        </Button>
      )}
    </Modal>
  );
};

export default EditNoteModal;
