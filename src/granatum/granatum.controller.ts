import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { ApiKeyGuard } from 'src/auth/api-guard';
import { GranatumService } from './granatum.service';
import { BillType } from '@prisma/client';

@Controller('granatum')
export class GranatumController {

    constructor(private granatumService: GranatumService) { }

    @UseGuards(ApiKeyGuard)
    @ApiSecurity('Api-Key')
    @Get('mensalidade')
    public async criarCobrancasMensalidade() {
        const socios = await this.granatumService.criarCobrancas(BillType.Mensalidade)
        return socios
    }

    @UseGuards(ApiKeyGuard)
    @ApiSecurity('Api-Key')
    @Get('cooperativa')
    public async criarCobrancasCooperativa() {
        const socios = await this.granatumService.criarCobrancas(BillType.Cooperativa)
        return socios
    }

}
