import { Module } from '@nestjs/common';
import { GuestbookController } from './guestbook.controller';
import { GuestbookService } from './guestbook.service';

@Module({
  imports: [],
  controllers: [GuestbookController],
  providers: [GuestbookService],
})
export class AppModule {}
