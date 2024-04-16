import { Controller, Get } from '@nestjs/common';
import { GranatumService } from './granatum.service';
import { ApiBody } from '@nestjs/swagger';

@Controller('granatum')
export class GranatumController {

    constructor(private granatumService: GranatumService) { }

    @Get()
    public async getSocios() {
        const socios = await this.granatumService.getSocios()
        return socios
    }

}
