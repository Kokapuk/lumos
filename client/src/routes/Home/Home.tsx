import { Add, SearchRounded } from '@mui/icons-material';
import { Fab, InputAdornment, Skeleton, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Note from '../../components/Note/Note';
import SessionExpiredModal from '../../components/SessionExpiredModal/SessionExpiredModal';
import useAuth from '../../hooks/useAuth';
import { INote } from '../../types';
import axios from '../../utils/axios';
import styles from './Home.module.scss';
import EditNoteModal from '../../components/CreateNoteModal/EditNoteModal';

const Home = () => {
  const [notes, setNotes] = useState<INote[]>([]);
  const [sortedNotes, setSortedNotes] = useState<INote[]>([]);
  const navigate = useNavigate();
  const [token, setToken] = useAuth();
  const [loading, setLoading] = useState(true);
  const [isSessionExpired, setSessionExpired] = useState(false);
  const [showCreateModal, setShowEditModal] = useState(false);
  const [editingNote, setEditingNote] = useState<INote | null>(null);

  useEffect(() => {
    if (!token) {
      return navigate('/signup');
    }

    const fetchNotes = async () => {
      try {
        const response = await axios.get('/notes', {
          headers: {
            Authorization: token,
          },
        });

        setNotes(response.data);
        setLoading(false);
      } catch (err: any) {
        console.log(err);

        if (err.response?.status === 440) {
          return setSessionExpired(true);
        }
      }
    };

    fetchNotes();
  }, [token]);

  useEffect(() => {
    setSortedNotes(
      notes.sort((a, b) => {
        return b.timeStamp - a.timeStamp;
      })
    );
  }, [notes]);

  const handleSaveNote = async (text: string, timeStamp: number, color: string) => {
    if (editingNote) {
      try {
        const response = await axios.patch(
          `/notes/${editingNote._id}`,
          { text, timeStamp, color },
          { headers: { Authorization: token } }
        );

        setNotes((prev) =>
          prev.map((note) => {
            if (note._id === editingNote._id) {
              note.text = response.data.text;
              note.timeStamp = response.data.timeStamp;
              note.color = response.data.color;
            }

            return note;
          })
        );
      } catch (err: any) {
        console.log(err);

        if (err.response?.status === 440) {
          setSessionExpired(true);
        }
      }
    } else {
      try {
        const response = await axios.post('/notes', { text, timeStamp, color }, { headers: { Authorization: token } });

        setNotes((prev) => [response.data, ...prev]);
      } catch (err: any) {
        console.log(err);

        if (err.response?.status === 440) {
          setSessionExpired(true);
        }
      }
    }

    setShowEditModal(false);
    setEditingNote(null);
  };

  const handleDeleteNote = async (_id: string) => {
    try {
      await axios.delete(`/notes/${_id}`, {
        headers: {
          Authorization: token,
        },
      });

      setNotes((prev) => prev.filter((note) => note._id !== _id));
    } catch (err: any) {
      console.log(err);

      if (err.response?.status === 440) {
        setSessionExpired(true);
      }
    }

    setShowEditModal(false);
    setEditingNote(null);
  };

  const handleEditNoteClose = () => {
    setShowEditModal(false);
    setEditingNote(null);
  };

  const handleNoteClick = (note: INote) => {
    setEditingNote(note);
    setShowEditModal(true);
  };

  return (
    <>
      <TextField
        className={styles.search}
        label='Search'
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <SearchRounded />
            </InputAdornment>
          ),
        }}
        variant='outlined'
        size='small'
      />
      <div className={styles['note-list']}>
        {loading
          ? [...Array(15)].map((_item, key) => <Skeleton key={key} height={150} width={225} animation='wave' />)
          : sortedNotes.map((note) => (
              <Note
                onClick={() => handleNoteClick(note)}
                key={note._id}
                text={note.text}
                color={note.color}
                timeStamp={note.timeStamp}
              />
            ))}
      </div>
      <SessionExpiredModal isSessionExpired={isSessionExpired} setToken={setToken} />
      <EditNoteModal
        open={showCreateModal}
        editing={editingNote}
        onClose={handleEditNoteClose}
        onSave={handleSaveNote}
        onDelete={handleDeleteNote}
      />
      <Fab onClick={() => setShowEditModal(true)} className={styles['create-note']} color='success' size='medium'>
        <Add />
      </Fab>
    </>
  );
};

export default Home;
