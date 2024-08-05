import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NoteService } from './note.service';
import { Note } from './schemas/note.schema';
import { PaginationOptions } from '../../libs/types/pagination';
import { paginate } from '../../libs/pagination';
import { Chance } from 'chance';

const chance = new Chance();

describe('NoteService', () => {
  let noteService: NoteService;

  const mockNoteModel = {
    create: jest.fn(),
    countDocuments: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NoteService,
        {
          provide: getModelToken(Note.name),
          useValue: mockNoteModel,
        },
      ],
    }).compile();

    noteService = module.get<NoteService>(NoteService);

    jest.clearAllMocks();
  });

  describe('createNote', () => {
    it('should create and return a note', async () => {
      const noteDto = { title: 'Test Note', content: 'Test Content' };
      const createdNote = { ...noteDto } as Note;

      mockNoteModel.create.mockResolvedValue(createdNote);

      const result = await noteService.createNote(noteDto);

      expect(result).toEqual(createdNote);
      expect(mockNoteModel.create).toHaveBeenCalledWith(noteDto);
      expect(mockNoteModel.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAllNotes', () => {
    it('should return paginated notes for the current user', async () => {
      const userId = chance.guid();
      const options: PaginationOptions = { page: 1, limit: 10 };
      const total = 2;
      const notes = [
        {
          title: chance.sentence({ words: 3 }),
          user: userId,
          content: chance.sentence(),
        },
        {
          title: chance.sentence({ words: 4 }),
          user: userId,
          content: chance.sentence(),
        },
        {
          title: chance.sentence({ words: 4 }),
          user: chance.guid(),
          content: chance.paragraph({ sentences: 1 }),
        },
      ] as Note[];

      mockNoteModel.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis().mockReturnValue([notes[0], notes[1]]),
      });

      mockNoteModel.countDocuments.mockResolvedValue(total);

      const filteredNotes = notes.filter((note) => note.user === userId);

      const result = await noteService.findAllNotes({ user: userId, options });

      expect(result).toEqual(paginate(filteredNotes, total, options));
      expect(mockNoteModel.countDocuments).toHaveBeenCalledWith({
        user: userId,
      });
      expect(mockNoteModel.find).toHaveBeenCalledWith({ user: userId });

      expect(mockNoteModel.find.mock.calls[0][0]).toEqual({ user: userId });
    });
  });

  describe('findByTags', () => {
    it('should return notes with specified tags', async () => {
      const tags = ['tag1', 'tag2'];
      const userId = chance.guid();
      const notes = [
        {
          title: chance.sentence({ words: 3 }),
          user: userId,
          content: chance.sentence(),
          tags: [tags[0]],
        },
        {
          title: chance.sentence({ words: 4 }),
          user: userId,
          content: chance.sentence(),
          tags: [tags[1]],
        },
        {
          title: chance.sentence({ words: 4 }),
          user: chance.guid(),
          content: chance.paragraph({ sentences: 1 }),
          tags: tags,
        },
      ] as Note[];

      mockNoteModel.find.mockResolvedValue(notes);

      const result = await noteService.findByTags({ tags });

      expect(result).toEqual(notes);
      expect(mockNoteModel.find).toHaveBeenCalledWith({ tags: { $in: tags } });
    });
  });

  describe('findNote', () => {
    it('should return a note by ID', async () => {
      const noteId = 'note123';
      const note = { title: 'Note by ID' } as Note;

      mockNoteModel.findById.mockResolvedValue(note);

      const result = await noteService.findNote(noteId);

      expect(result).toEqual(note);
      expect(mockNoteModel.findById).toHaveBeenCalledWith(noteId);
    });
  });

  describe('updateNote', () => {
    it('should update a note and return true', async () => {
      const noteId = chance.guid();
      const updateInput = { title: chance.sentence() };

      mockNoteModel.updateOne.mockResolvedValue({ nModified: 1 });

      const result = await noteService.updateNote({
        id: noteId,
        note: updateInput,
      });

      expect(result).toBe(true);
      expect(mockNoteModel.updateOne).toHaveBeenCalledWith(
        { _id: noteId },
        updateInput,
      );
    });
  });

  describe('deleteNote', () => {
    it('should delete a note and return true', async () => {
      const noteId = chance.guid();

      mockNoteModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

      const result = await noteService.deleteNote(noteId);

      expect(result).toBe(true);
      expect(mockNoteModel.deleteOne).toHaveBeenCalledWith({ _id: noteId });
    });
  });
});
