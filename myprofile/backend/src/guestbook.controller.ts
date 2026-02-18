import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { GuestbookService } from './guestbook.service';

type CreateGuestbookDto = {
  name: string;
  message: string;
};

type UpdateGuestbookDto = {
  name: string;
  message: string;
};

@Controller('guestbook')
export class GuestbookController {
  constructor(private readonly guestbookService: GuestbookService) {}

  @Get()
  getEntries() {
    return this.guestbookService.getAll();
  }

  @Post()
  createEntry(@Body() body: CreateGuestbookDto) {
    return this.guestbookService.create(body.name, body.message);
  }

  @Put(':id')
  updateEntry(@Param('id') id: string, @Body() body: UpdateGuestbookDto) {
    return this.guestbookService.update(id, body.name, body.message);
  }

  @Delete(':id')
  deleteEntry(@Param('id') id: string) {
    return this.guestbookService.delete(id);
  }
}
