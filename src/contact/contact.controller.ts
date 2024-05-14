import { Body, Controller, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contract.dto';

@Controller('contact')
export class ContactController {
    constructor(private contactService: ContactService) { }

    @Post()
    public async create(@Body() requestData: CreateContactDto) {

        const { id, ...contact } = await this.contactService.create(requestData)
        return {
            id: id.toString(),
            ...contact
        }
    }
}
