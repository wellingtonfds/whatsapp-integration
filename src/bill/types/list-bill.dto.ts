import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, Max, Min } from "class-validator";

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

}