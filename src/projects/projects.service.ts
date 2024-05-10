import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto, user: User) {
    const newProject = this.projectRepository.create({
      ...createProjectDto,
      userCreate: user,
    });
    const project = this.projectRepository.save(newProject);
    return project;
  }
  async createPostulate(
    projectId: string,
    user: User,
  ): Promise<Project | null> {
    try {
      const project = await this.projectRepository.findOneOrFail({
        where: { id: projectId },
        relations: ['usersAdmitted'],
      });

      // Verifica si el proyecto existe
      if (!project) {
        return null; // Si no existe, devuelve null
      }

      // Verifica si el usuario ya está admitido en el proyecto
      const isUserAdmitted = project.usersAdmitted.some(
        (u) => u.id === user.id,
      );
      if (isUserAdmitted) {
        return project; // Si el usuario ya está admitido, no hacemos nada y devolvemos el proyecto
      }

      // Agrega al usuario a la lista de usuarios admitidos
      project.usersAdmitted.push(user);

      // Guarda los cambios en la base de datos
      await this.projectRepository.save(project);

      return project; // Devuelve el proyecto actualizado
    } catch (error) {
      // Maneja cualquier error que pueda ocurrir durante la operación
      console.error('Error creating postulate:', error.message);
      return null; // Devuelve null en caso de error
    }
  }

  findAll() {
    return this.projectRepository.find({
      relations: ['userCreate', 'usersAdmitted'],
    });
  }

  async findOne(id: string) {
    const test = await this.projectRepository.findOne({
      where: { id },
      relations: ['userCreate', 'usersAdmitted'],
    });
    return test;
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
