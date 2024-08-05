import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note, NoteDocument } from './schemas/note.schema';
import {
  PaginationOptions,
  PaginatedResult,
} from '../../libs/types/pagination';
import { paginate } from '../../libs/pagination';

@Injectable()
export class NoteService {
  constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) {}

  async createNote(note: Partial<Note>): Promise<Partial<Note>> {
    return this.noteModel.create(note);
  }

  async findAllNotes(params: {
    user: string;
    options: PaginationOptions;
  }): Promise<PaginatedResult<Note>> {
    const { page, limit } = params.options;
    const total = await this.noteModel.countDocuments({ user: params.user });

    const notes = await this.noteModel
      .find({ user: params.user })
      .skip((page - 1) * limit)
      .limit(limit);

    return paginate(notes, total, { page, limit });
  }

  async findByTags(params: { tags: string[] }): Promise<Note[]> {
    return this.noteModel.find({ tags: { $in: params.tags } });
  }

  async findNote(id: string): Promise<Note> {
    return this.noteModel.findById(id);
  }

  async updateNote(params: {
    id: string;
    note: Partial<Note>;
  }): Promise<boolean> {
    try {
      await this.noteModel.updateOne({ _id: params.id }, params.note);
      return true;
    } catch (err) {
      console.log(err);
      throw new Error('Failed to update note');
    }
  }

  async deleteNote(noteId: string): Promise<boolean> {
    try {
      const deletedNote = await this.noteModel.findByIdAndDelete(noteId);
      return !!deletedNote;
    } catch (error) {
      throw new Error('Failed to delete note');
    }
  }
}
