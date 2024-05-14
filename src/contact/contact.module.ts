import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactRepository } from './contact.repository';
import { ContactService } from './contact.service';

@Module({
  providers: [ContactService, ContactRepository],
  controllers: [ContactController],
  exports: [ContactService, ContactRepository]
})
export class ContactModule { }
