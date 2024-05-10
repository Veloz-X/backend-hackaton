import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'empresa@gmail.com',
    required: true,
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'JOFFRE ANDRES VELOZ PAZMIÑO',
    required: true,
  })
  @IsString()
  @MinLength(3)
  fullName: string;

  @ApiProperty({
    example: ['user', 'company'],
    required: true,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsString({ each: true })
  roles: string[];

  @ApiProperty({
    example: {
      yearsofexp: '5 Años',
      language: ['Spanish', 'English'],
      timezone: '(UTC-05:00) Bogota, Lima, Quito',
      hoursavailable: '7:00 AM - 5:00 PM',
      skills: ['Node.js', 'React.js', 'Angular.js'],
      location: 'Quito, Ecuador',
      cv: 'https://...................pdf',
    },
    required: true,
  })
  @IsObject()
  @IsOptional()
  data: any | null;

  @ApiProperty({
    example: 'Abc123',
    required: true,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;
}
