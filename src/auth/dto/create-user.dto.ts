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
    example: 'JOFFRE ANDRES VELOZ PAZMIÑO',
    required: true,
  })
  @IsString()
  @MinLength(3)
  fullName: string;

  @ApiProperty({
    example: 'empresa@gmail.com',
    required: true,
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '0980061377',
    required: true,
  })
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty({
    example: '7:00 AM - 5:00 PM',
    required: true,
  })
  @IsString()
  @IsOptional()
  hoursavailable: string;

  @ApiProperty({
    example: 'Samborondon , Guayas',
    required: true,
  })
  @IsString()
  @IsOptional()
  location: string;

  @ApiProperty({
    example: '5',
    required: true,
  })
  @IsString()
  @IsOptional()
  yearsexperience: string;

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
    // example: {
    //   yearsofexp: '5 Años',
    //   hoursavailable: '7:00 AM - 5:00 PM',
    //   location: 'Samborondon, Guayas',
    //   bio: 'Yo soy programdor de software con 5 años de experiencia en desarrollo de aplicaciones web y móviles. Me gusta trabajar en equipo y aprender nuevas tecnologías.',
    // },
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
