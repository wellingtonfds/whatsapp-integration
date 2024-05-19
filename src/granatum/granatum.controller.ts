import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { ApiKeyGuard } from '../auth/api-guard';
import { GranatumService } from './granatum.service';

@Controller('granatum')
export class GranatumController {

    constructor(private granatumService: GranatumService) { }

    @UseGuards(ApiKeyGuard)
    @ApiSecurity('Api-Key')
    @Get()
    public async getSocios() {
        const socios = await this.granatumService.getSocios()
        return socios
    }

}
