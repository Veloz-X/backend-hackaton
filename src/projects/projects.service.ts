import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { HttpService } from '@nestjs/axios';
import { ok } from 'assert';

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
      relations: ['usersAdmitted'],
      order: { createDate: 'DESC' },
    });
  }

  async findOne(id: string) {
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
    for (const user of project.usersAdmitted) {
      const body = {
        job_description: `Estamos buscando una profecional con estos requerimientos ${project.team_profile} y este es el objetivo del proyecto ${project.objective} para el siguiente proyecto ${project.description}`,
        resume_text: `Soy un profecional con ${user.yearsexperience} de experiencia en el area de ${user.bio} tambien soy de la localidas de ${user.location} y me encuentro disponible de ${user.location}`,
      };

      const jobMatcherResponse = await this.httpService
        .post(url, body, config)
        .toPromise();

      user.jobMatcherResponses = jobMatcherResponse.data;
    }

    return project;
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
