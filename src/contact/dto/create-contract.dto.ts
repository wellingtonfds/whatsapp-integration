import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateContactDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    crmId: number

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

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string



}