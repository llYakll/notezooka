const request = require('supertest');
const { app, server } = require('./server');

describe('Express Server Tests', () => {
    afterAll((done) => {
        server.close(done); // Close server after all tests are done
    });

    // Test HTML endpoints
    describe('HTML Endpoints', () => {
        it('responds with HTML content for the home route', async () => {
            const response = await request(app).get('/');
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toMatch(/text\/html/);
        });

        it('responds with HTML content for the notes route', async () => {
            const response = await request(app).get('/notes');
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toMatch(/text\/html/);
        });
    });

    // Test API endpoints
    describe('API Endpoints', () => {
        let testNoteId;

        it('creates a new note for POST /api/notes', async () => {
            const newNote = {
                title: 'Test Note',
                text: 'This is a test note'
            };

            const response = await request(app)
                .post('/api/notes')
                .send(newNote);

            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toMatch(/application\/json/);
            expect(response.body).toHaveProperty('id');
            testNoteId = response.body.id; // Store the ID for subsequent tests
        });

        it('retrieves all notes for GET /api/notes', async () => {
            const response = await request(app).get('/api/notes');
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toMatch(/application\/json/);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it('updates an existing note for PUT /api/notes/:id', async () => {
            const updatedNote = {
                title: 'Updated Test Note',
                text: 'This is the updated test note'
            };

            const response = await request(app)
                .put(`/api/notes/${testNoteId}`)
                .send(updatedNote);

            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toMatch(/application\/json/);
            expect(response.body.title).toBe(updatedNote.title);
            expect(response.body.text).toBe(updatedNote.text);
        });

        it('deletes an existing note for DELETE /api/notes/:id', async () => {
            const response = await request(app).delete(`/api/notes/${testNoteId}`);
            expect(response.status).toBe(204); // Expect 204 (No Content) on successful deletion
        });
    });
});