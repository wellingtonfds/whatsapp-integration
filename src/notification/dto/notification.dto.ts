import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"

export class NotificationDto {

    @ApiProperty()
    @IsNotEmpty()
    to: string

    @ApiProperty()
    template?: string

    @ApiProperty()
    parameters?: string[]

    @ApiProperty()
    text?: string
}