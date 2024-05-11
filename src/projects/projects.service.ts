import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ProjectsService {
  constructor(
    private httpService: HttpService,

    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto, user: User) {
    try {
      const newProject = this.projectRepository.create({
        ...createProjectDto,
        userCreate: user,
      });
      const project = this.projectRepository.save(newProject);
      return {
        status: true,
        message: 'Proyecto creado con exito',
      };
    } catch (error) {
      return {
        status: false,
        message: 'Error al crear proyecto',
      };
    }
  }

  async createPostulate(projectId: string, user: User) {
    try {
      const project = await this.projectRepository.findOneOrFail({
        where: { id: projectId },
        relations: ['usersAdmitted'],
      });

      if (!project) {
        return null;
      }

      const isUserAdmitted = project.usersAdmitted.some(
        (u) => u.id === user.id,
      );
      if (isUserAdmitted) {
        return project;
      }
      project.usersAdmitted.push(user);

      await this.projectRepository.save(project);

      return {
        status: true,
        message: 'Usuario agregado al proyecto',
      };
    } catch (error) {
      return {
        status: false,
        message: 'Error al agregar usuario al proyecto',
      };
    }
  }

  async findAll(user: User) {
    return this.projectRepository.find({
      where: { userCreate: { id: user.id } },
      relations: ['usersAdmitted', 'userCreate'],
      order: { createDate: 'DESC' },
    });
  }

  async findOne(id: string) {
    try {
      const project = await this.projectRepository.findOne({
        where: { id },
        relations: ['userCreate', 'usersAdmitted'],
      });

      const url = `https://lionfish-app-vqcsn.ondigitalocean.app/v1/job-matcher`;

      const config = {
        headers: {
          Authorization: `Bearer _5fBJtJo9prSSWOsAHGZ9OiwJr_EArbC1XXcMXxjWW8`,
        },
      };
      const requests = project.usersAdmitted.map(async (user) => {
        const body = {
          job_description: `Estamos buscando una profesional con estos requerimientos ${project.team_profile} y este es el objetivo del proyecto ${project.objective} para el siguiente proyecto ${project.description}`,
          resume_text: `Soy un profesional con ${user.bio} y soy de la localidad de ${user.location} `,
        };

        try {
          const jobMatcherResponsePromise = this.httpService
            .post(url, body, config)
            .toPromise();
          const jobMatcherResponse = await Promise.race([
            jobMatcherResponsePromise,
          ]);
          user.jobMatcherResponses = jobMatcherResponse.data;
        } catch (error) {
          user.jobMatcherResponses = {
            job_description_match: 'Sin conexion a la AI',
            matching_keywords: ['Sin conexion a la AI'],
            profile_summary: 'Sin conexion a la AI',
          };
        }
      });

      await Promise.all(requests);

      return {
        status: true,
        data: project,
      };
    } catch (error) {
      console.log(error);
      return {
        status: false,
        message: 'Error en cargar proyecto - API',
      };
    }
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['userCreate', 'usersAdmitted'],
    });
    if (!project) {
      return null;
    }
    const updatedProject = Object.assign(project, updateProjectDto);
    return this.projectRepository.save(updatedProject);
  }

  async remove(id: string) {
    await this.projectRepository.delete(id);
  }
}
