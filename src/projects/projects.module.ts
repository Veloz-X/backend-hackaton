import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { AuthModule } from 'src/auth/auth.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
  imports: [AuthModule,HttpModule, TypeOrmModule.forFeature([Project])],
  exports: [ProjectsService],
})
export class ProjectsModule {}
