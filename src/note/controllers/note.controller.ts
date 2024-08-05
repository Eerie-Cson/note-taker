import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Req,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { NoteService } from '../note.service';
import { Note } from '../schemas/note.schema';
import { PaginationOptions } from '../../../libs/types/pagination';
import { RolesGuard } from '../../auth/roles/roles.guard';

@Controller('api/notes')
@UseGuards(RolesGuard)
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  // @Roles(Role.User, Role.Admin)
  async createNote(@Body() note: Partial<Note>, @Req() req: any) {
    if (!req.user) {
      throw new NotFoundException('User not found');
    }

    if (!req.user.email) {
      throw new NotFoundException('User email not found');
    }

    const createdNote = await this.noteService.createNote({
      ...note,
      user: req.user.email,
    });

    if (!createdNote) {
      throw new NotFoundException('Note not created');
    }

    return createdNote;
  }

  @Get()
  async findAllNotes(
    @Query('page') page,
    @Query('limit') limit,
    @Req() req: any,
  ) {
    const options: PaginationOptions = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
    };
    return await this.noteService.findAllNotes({
      options,
      user: req.user.email,
    });
  }

  @Get('tags')
  async findByTags(@Query('tags') tags: string) {
    return await this.noteService.findByTags({ tags: tags.split(',') });
  }

  @Get(':id')
  async findNote(@Param('id') id: string) {
    const note = await this.noteService.findNote(id);
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    return note;
  }

  @Put(':id')
  async updateNote(@Param('id') id: string, @Body() note: Note) {
    const updatedNote = await this.noteService.updateNote({ id, note });
    if (!updatedNote) {
      throw new NotFoundException('Note not found');
    }
    return updatedNote;
  }

  @Delete(':id')
  async deleteNote(@Param('id') id: string) {
    return await this.noteService.deleteNote(id);
  }
}
