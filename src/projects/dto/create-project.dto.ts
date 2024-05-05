import { ApiProperty } from "@nestjs/swagger";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsEmail, IsString } from "class-validator";

export class CreateProjectDto {
  
    @ApiProperty({
      example: ['logistics', 'transport'],
      required: true,
    })
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(10)
    @IsString({ each: true })
    industry: string[];

    @ApiProperty({
      example: '2021-01-01',
      required: true,
    })
    @IsString()
    startDate: string;

    @ApiProperty({
      example: '2021-01-01',
      required: true,
    })
    @IsString()
    finishDate: string;

    @ApiProperty({
      example: '2021-05-01',
      required: true,
    })
    @IsString()
    name: string;

    @ApiProperty({
      example: 'Desarrollo de Plataforma de Logística para Optimización de Rutas',
      required: true,
    })
    @IsString()
    description: string;

    @ApiProperty({
      example: 'Crear una plataforma web y móvil que permita a las empresas de logística optimizar sus rutas de entrega, reduciendo costos y tiempos de entrega',
      required: true,
    })
    @IsString()
    scopes: string;

    @ApiProperty({
      example: 'Implementar algoritmos de optimización de rutas, integrar sistemas de seguimiento de vehículos en tiempo real, y desarrollar una interfaz intuitiva para usuarios finales y administradores',
      required: true,
    })
    @IsString()
    objective: string;

    @ApiProperty({
      example: '$2000.00',
      required: true,
    })
    @IsString()
    budget: string;

    @ApiProperty({
      example: 'Experiencia en desarrollo de aplicaciones web y móviles, conocimientos en algoritmos de optimización, familiaridad con sistemas de seguimiento GPS',
      required: true,
    })
    @IsString()
    requirements: string;

    @ApiProperty({
      example: 'Desarrolladores Full-stack con experiencia en logística y sistemas de seguimiento. Información del Cliente: Industria de Logística, Ubicación: Ciudad de México, México',
      required: true,
    })
    @IsString()
    team_profile: string;
  }
  