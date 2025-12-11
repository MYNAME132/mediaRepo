import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'ordID' })//should be UUID v4 but let it be just string
  organization: string;

  @IsEmail()
  @ApiProperty({ example: 'some@gmail.com'})
  email: string;

  @MinLength(6)
  @ApiProperty({ example: 'strongPassword123'})
  password: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'John Doe'})
  name: string;
}