import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty, IsObject, IsString } from "class-validator"

export class CreateNotificationDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum({ 'TEMPLATE': 'TEXT' })
    type: 'TEMPLATE' | 'TEXT'

    @ApiProperty()
    @IsNotEmpty()
    @IsObject()
    message: object

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    to: string
}