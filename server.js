const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid')

const app = express();
const PORT = process.env.PORT || 3000;

//mw------------------------------------------------------------------------------------------------------------mw
app.use(express.json());
// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// notes route
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

/*API ROUTES get, post, put, delete*/
//get-----------------------------------------------------------------------------------------------------------get
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server error' });
        }
        try {
            const notes = JSON.parse(data);
            res.json(notes);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error parsing JSON data' });
        }
    });
});

//post------------------------------------------------------------------------------------------------------------post
app.post('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server error' });
        }
        try {
            const notes = JSON.parse(data);
            const newNote = {
                id: uuidv4(),
                title: req.body.title,
                text: req.body.text
            };
            notes.push(newNote);
            fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes), (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Server error' });
                }
                res.json(newNote);
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error processing request' });
        }
    });
});

  // put--------------------------------------------------------------------------------------------------------------------put
  app.put('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server error' });
        }
        try {
            const notes = JSON.parse(data);
            const updatedNoteIndex = notes.findIndex((note) => note.id === noteId);
            if (updatedNoteIndex === -1) {
                return res.status(404).json({ message: 'Note not found' });
            }
            notes[updatedNoteIndex].title = req.body.title || notes[updatedNoteIndex].title;
            notes[updatedNoteIndex].text = req.body.text || notes[updatedNoteIndex].text;
            fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes), (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Server error' });
                }
                res.json(notes[updatedNoteIndex]);
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error updating note' });
        }
    });
});
//delete--------------------------------------------------------------------------------------------------------------------------delete

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server error' });
        }
        try {
            const notes = JSON.parse(data);
            const filteredNotes = notes.filter((note) => note.id !== noteId);
            fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(filteredNotes), (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Server error' });
                }
                res.status(204).end();
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error deleting note' });
        }
    });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});

// Export app and server for testing.
module.exports = { app, server };