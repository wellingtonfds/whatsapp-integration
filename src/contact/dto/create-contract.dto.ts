import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class CreateContactDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    phoneNumber: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    CPF: string


    @ApiProperty({
        required: false
    })
    @IsString()
    email?: string

    @ApiProperty({
        required: false
    })
    @IsString()
    name?: string

}