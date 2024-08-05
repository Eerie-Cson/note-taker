import { Test, TestingModule } from '@nestjs/testing';
import { NoteController } from './note.controller';
import { NoteService } from '../note.service';
import { Note } from '../schemas/note.schema';
import { Chance } from 'chance';

const chance = new Chance();

describe('NoteController', () => {
  let controller: NoteController;

  const mockNoteService = {
    createNote: jest.fn(),
    findAllNotes: jest.fn(),
    findNote: jest.fn(),
    updateNote: jest.fn(),
    deleteNote: jest.fn(),
    findByTags: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoteController],
      providers: [
        {
          provide: NoteService,
          useValue: mockNoteService,
        },
      ],
    }).compile();

    controller = module.get<NoteController>(NoteController);
  });

  describe('createNote', () => {
    it('should create a note', async () => {
      const noteDto: Partial<Note> = {
        title: chance.sentence({ words: 3 }),
        content: chance.sentence(),
      };
      const userEmail = chance.email();
      const createdNote = { ...noteDto, user: userEmail };

      mockNoteService.createNote.mockResolvedValue(createdNote);

      const req = { user: { email: userEmail } };
      const result = await controller.createNote(noteDto, req);

      expect(result).toEqual(createdNote);
      expect(mockNoteService.createNote).toHaveBeenCalledWith({
        ...noteDto,
        user: userEmail,
      });
    });
  });

  describe('findAllNotes', () => {
    it('should return paginated notes', async () => {
      const userEmail = chance.email();
      const options = { page: 1, limit: 10 };
      const notes = [
        {
          title: chance.sentence({ words: 3 }),
          user: userEmail,
          content: chance.sentence(),
        },
        {
          title: chance.sentence({ words: 4 }),
          user: userEmail,
          content: chance.sentence(),
        },
      ] as Note[];

      mockNoteService.findAllNotes.mockResolvedValue(notes);

      const req = { user: { email: userEmail } };
      const result = await controller.findAllNotes('1', '10', req);

      expect(result).toEqual(notes);
      expect(mockNoteService.findAllNotes).toHaveBeenCalledWith({
        options,
        user: userEmail,
      });
    });
  });

  describe('findNote', () => {
    it('should return a single note by id', async () => {
      const noteId = chance.guid();
      const note = {
        title: chance.sentence(),
        user: chance.email(),
        content: chance.sentence(),
      } as Note;

      mockNoteService.findNote.mockResolvedValue(note);

      const result = await controller.findNote(noteId);

      expect(result).toEqual(note);
      expect(mockNoteService.findNote).toHaveBeenCalledWith(noteId);
    });
  });

  describe('updateNote', () => {
    it('should update a note by id', async () => {
      const noteId = chance.guid();
      const updateNote: Note = {
        title: chance.sentence(),
        user: chance.email(),
        content: chance.sentence(),
      } as Note;

      mockNoteService.updateNote.mockResolvedValue(updateNote);

      const result = await controller.updateNote(noteId, updateNote);

      expect(result).toEqual(updateNote);
      expect(mockNoteService.updateNote).toHaveBeenCalledWith({
        id: noteId,
        note: updateNote,
      });
    });
  });

  describe('deleteNote', () => {
    it('should delete a note by id', async () => {
      const noteId = chance.guid();

      mockNoteService.deleteNote.mockResolvedValue({ deleted: true });

      const result = await controller.deleteNote(noteId);

      expect(result).toEqual({ deleted: true });
      expect(mockNoteService.deleteNote).toHaveBeenCalledWith(noteId);
    });
  });

  describe('findByTags', () => {
    it('should return notes by tags', async () => {
      const tags = 'tag1,tag2';
      const notes = [
        {
          title: chance.sentence(),
          user: chance.email(),
          content: chance.sentence(),
          tags: ['tag1', 'tag2'],
        },
      ] as Note[];

      mockNoteService.findByTags.mockResolvedValue(notes);

      const result = await controller.findByTags(tags);

      expect(result).toEqual(notes);
      expect(mockNoteService.findByTags).toHaveBeenCalledWith({
        tags: ['tag1', 'tag2'],
      });
    });
  });
});
