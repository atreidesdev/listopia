import { Roles } from '@common/decorators/roles.decorator';

import { RolesGuard } from '@common/guards/RolesGuard/roles.guard';
import type { CreateDeveloperType } from '@modules/content/developer/types/createdeveloper.type';
import type { GetDevelopersType } from '@modules/content/developer/types/getdevelopers.type';
import type { UpdateDeveloperTypeWithoutId } from '@modules/content/developer/types/updatedeveloper.type';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Developer } from '@prisma/client';
import { DeveloperService } from './developer.service';

@Controller('developer')
export class DeveloperController {
  constructor(private readonly developerService: DeveloperService) {}

  @Get(':id')
  async getDeveloper(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Developer> {
    return this.developerService.getDeveloper(id);
  }

  @Get()
  async getDevelopers(
    @Query() getDevelopersData: GetDevelopersType,
  ): Promise<Developer[]> {
    return this.developerService.getDevelopers(getDevelopersData);
  }

  @UseGuards(RolesGuard)
  @Roles('admin', 'developer', 'editor')
  @Post()
  async createDeveloper(
    @Body() createDeveloperData: CreateDeveloperType,
  ): Promise<Developer> {
    return this.developerService.createDeveloper(createDeveloperData);
  }

  @UseGuards(RolesGuard)
  @Roles('admin', 'developer', 'editor')
  @Put(':id')
  async updateDeveloper(
    @Body() updateDeveloperData: UpdateDeveloperTypeWithoutId,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Developer> {
    return this.developerService.updateDeveloper({
      ...updateDeveloperData,
      id: id,
    });
  }

  @UseGuards(RolesGuard)
  @Roles('admin', 'developer', 'editor')
  @Delete(':id')
  async deleteDeveloper(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Developer> {
    return this.developerService.deleteDeveloper(id);
  }
}
