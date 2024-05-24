import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsObject, IsString } from "class-validator"

export class CreateNotificationDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    type: 'TEMPLATE' | 'TEXT'

    @ApiProperty()
    @IsNotEmpty()
    @IsObject()
    message: object

}