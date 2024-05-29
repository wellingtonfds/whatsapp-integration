import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { ApiKeyGuard } from 'src/auth/api-guard';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contract.dto';

@Controller('contact')
export class ContactController {
    constructor(private contactService: ContactService) { }

    @UseGuards(ApiKeyGuard)
    @ApiSecurity('Api-Key')
    @Post()
    public async create(@Body() requestData: CreateContactDto) {

        const { id, ...contact } = await this.contactService.createOrUpdate(requestData)
        return {
            id: id.toString(),
            ...contact
        }
    }
}
