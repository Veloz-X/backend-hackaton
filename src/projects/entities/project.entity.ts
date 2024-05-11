import { User } from 'src/auth/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  startDate: string;

  @Column()
  finishDate: string;

  @Column()
  description: string;

  @Column()
  scopes: string;

  @Column()
  objective: string;

  @Column()
  budget: string;

  @Column()
  requirements: string;

  @Column()
  team_profile: string;

  @Column('json', { nullable: true, default: { data: 'data' } })
  data: string;

  @Column('bool', { default: true })
  status: boolean;

  @ManyToOne(() => User, (user) => user.projectCreate)
  userCreate: User;

  @ManyToMany(() => User, (user) => user.projectsAdmitted,{nullable:true})
  @JoinTable()
  usersAdmitted: User[];

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
}
