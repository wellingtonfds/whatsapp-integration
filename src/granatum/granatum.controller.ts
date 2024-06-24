import { Controller, Get } from '@nestjs/common';
import { GranatumService } from './granatum.service';

@Controller('granatum')
export class GranatumController {

    constructor(private granatumService: GranatumService) { }

    // @UseGuards(ApiKeyGuard)
    // @ApiSecurity('Api-Key')
    @Get()
    public async getSocios() {
        // const socios = await this.granatumService.getSocios()
        // return socios
        await this.granatumService.testeBaixarPagamentos()
        return 'ok'
    }

}
