import { Add, LogoutRounded, SearchRounded } from '@mui/icons-material';
import { Button, Fab, InputAdornment, Skeleton, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EditNoteModal from '../../components/EditNoteModal/EditNoteModal';
import Note from '../../components/Note/Note';
import SessionExpiredModal from '../../components/SessionExpiredModal/SessionExpiredModal';
import useAuth from '../../hooks/useAuth';
import { INote, INoteData } from '../../types';
import axios from '../../utils/axios';
import styles from './Home.module.scss';

const Home = () => {
  const [notes, setNotes] = useState<INote[]>([]);
  const [sortedNotes, setSortedNotes] = useState<INote[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
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

    const fetchData = async () => {
      try {
        const responseNotes = await axios.get('/notes', {
          headers: {
            Authorization: token,
          },
        });

        setNotes(responseNotes.data);
        setLoading(false);
      } catch (err: any) {
        console.log(err);

        if (err.response?.status === 440) {
          return setSessionExpired(true);
        }
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    const timeSorted = [...notes].sort((a, b) => {
      return a.timeStamp - b.timeStamp;
    });

    const completedSorted = timeSorted.sort((a, b) => {
      if (a.completed === b.completed) {
        return 0;
      } else if (a.completed) {
        return 1;
      } else {
        return -1;
      }
    });

    setSortedNotes(completedSorted);
  }, [notes]);

  const handleSaveNote = async (noteData: INoteData) => {
    try {
      if (editingNote) {
        const response = await axios.patch(`/notes/${editingNote._id}`, noteData, { headers: { Authorization: token } });

        setNotes((prev) =>
          prev.map((note) => {
            if (note._id === editingNote._id) {
              note = response.data;
            }

            return note;
          })
        );
      } else {
        const response = await axios.post('/notes', noteData, { headers: { Authorization: token } });

        setNotes((prev) => [response.data, ...prev]);
      }
    } catch (err: any) {
      console.log(err);

      if (err.response?.status === 440) {
        setSessionExpired(true);
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
      <div className={styles.header}>
        <TextField
          autoComplete='off'
          className={styles.search}
          label='Search'
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
        <Button onClick={() => setToken(null)} color='error' sx={{ whiteSpace: 'nowrap' }}>
          <LogoutRounded />
        </Button>
      </div>
      <div className={styles['note-list']}>
        {loading
          ? [...Array(15)].map((_item, key) => <Skeleton key={key} height={150} width={225} animation='wave' />)
          : sortedNotes.map(
              (note) =>
                note.text.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()) && (
                  <Note onClick={() => handleNoteClick(note)} key={note._id} noteData={note} />
                )
            )}
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
