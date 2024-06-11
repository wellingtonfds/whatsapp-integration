import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsNumber, Max, Min } from "class-validator";
import { ToBoolean } from "src/helper/to-boolean";

export class ListBillDto {

    @ApiProperty()
    @IsNumber({
        maxDecimalPlaces: 0,
    })
    @Min(1)
    @Max(12)
    @Type(() => Number)
    month: number

    @ApiProperty()
    @IsNumber({
        maxDecimalPlaces: 0,
    })
    @Min(2024)
    @Max(2030)
    @Type(() => Number)
    year: number

    @ApiProperty({
        required: false,
        default: false
    })
    @IsBoolean()
    @ToBoolean()
    withPixKey?: boolean

}