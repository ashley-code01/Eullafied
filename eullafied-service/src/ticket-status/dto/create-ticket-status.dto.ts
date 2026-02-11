import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateTicketStatusDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    status_name: string;
}
