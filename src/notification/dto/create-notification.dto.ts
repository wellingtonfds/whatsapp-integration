import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty, IsObject } from "class-validator"

export class CreateNotificationDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum({ 'TEMPLATE': 'TEXT' })
    type: 'TEMPLATE' | 'TEXT'

    @ApiProperty()
    @IsNotEmpty()
    @IsObject()
    message: object

}