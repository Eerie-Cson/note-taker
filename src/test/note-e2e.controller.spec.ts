import * as request from 'supertest';
import * as jwt from 'jsonwebtoken';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';

import { Chance } from 'chance';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import { Note, NoteSchema } from '../note/schemas/note.schema';
import { Connection } from 'mongoose';

const chance = new Chance();

function generateToken(user: { email: string; roles?: string[] }) {
  const payload = {
    email: user.email,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

describe('NoteController (e2e)', () => {
  let app;
  let token: string;
  let mongoServer: MongoMemoryServer;
  let connection: Connection;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        MongooseModule.forRoot(mongoUri),
        MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    token = generateToken({ email: 'testuser' });
    connection = app.get('DatabaseConnection');
  });

  afterAll(async () => {
    await mongoServer.stop();
    await app.close();
  });

  afterEach(async () => {
    await connection.dropDatabase();
  });

  describe('Unauthenticated', () => {
    it('/api/notes (POST) should require authentication', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/notes')
        .send({ title: 'Test Note', content: 'Test Content' })
        .expect(401);

      expect(response.body.error).toBe('Unauthorized');
    });
  });

  describe('Authenticated', () => {
    it('/api/notes (POST) should create a note', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: chance.sentence({ words: 3 }),
          content: chance.paragraph(),
        })
        .expect(201);

      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('content');
    });

    it('/api/notes (GET) should return all notes with authentication', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');
    });

    it('/api/notes/:id (GET) should return a single note', async () => {
      const createdNote = await request(app.getHttpServer())
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Single Note', content: 'Content' });

      const noteId = createdNote.body._id;
      const response = await request(app.getHttpServer())
        .get(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('title', 'Single Note');
      expect(response.body).toHaveProperty('content', 'Content');
    });

    it('/api/notes/:id (PUT) should update a note', async () => {
      const createdNote = await request(app.getHttpServer())
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Update Note', content: 'Initial Content' });

      const noteId = createdNote.body._id;

      const response = await request(app.getHttpServer())
        .put(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Updated Note', content: 'Updated Content' })
        .expect(200);

      expect(JSON.parse(response.text)).toBe(true);
    });

    it('/api/notes/:id (DELETE) should delete a note with authentication', async () => {
      const createdNote = await request(app.getHttpServer())
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Delete Note', content: 'Content' });

      const noteId = createdNote.body._id;

      const deleteResponse = await request(app.getHttpServer())
        .delete(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const findResponse = await request(app.getHttpServer())
        .get(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(JSON.parse(deleteResponse.text)).toBe(true);
      expect(findResponse.body).toHaveProperty('message', 'Note not found');
      expect(findResponse.body).toHaveProperty('error', 'Not Found');
    });

    it('/api/notes/tags (GET) should return notes by tags', async () => {
      await request(app.getHttpServer())
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Tag Note',
          content: 'Content',
          tags: ['tag1', 'tag2'],
        });

      const response = await request(app.getHttpServer())
        .get('/api/notes/tags')
        .query({ tags: 'tag1,tag2' })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
