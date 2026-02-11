import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateTicketCategoryDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
}