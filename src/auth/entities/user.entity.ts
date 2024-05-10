import { ApiProperty } from '@nestjs/swagger';
import { Project } from 'src/projects/entities/project.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  fullName: string;

  @Column('jsonb', { nullable: true }) // Puedes usar jsonb para estructuras JSON más complejas
jobMatcherResponses: {
    job_description_match: string;
    matching_keywords: string[];
    profile_summary: string;
};

  @Column({ nullable: true })
  phone: string;

  @Column('json', { nullable: true })
  data: string;

  @Column('text', {
    select: false,
  })
  password: string;

  @Column('bool', { default: true })
  isActive: boolean;

  @Column('text', { array: true, default: ['user'] })
  roles: string[];

  @CreateDateColumn({})
  createDate: Date;

  @UpdateDateColumn({})
  updateDate: Date;

  @OneToMany(() => Project, (project) => project.userCreate)
  projectCreate: Project[];

  @ManyToMany(() => Project, (project) => project.usersAdmitted)
  projectsAdmitted: Project[];

  @BeforeInsert()
  checkEmailInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkEmailUpdate() {
    this.email = this.email.toLowerCase().trim();
  }
}
