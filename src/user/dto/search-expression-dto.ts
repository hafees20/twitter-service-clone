import { IsNotEmpty, IsString } from "class-validator";

export class SearchExpressionDto {
    @IsNotEmpty()
    @IsString()
    expression: string
}