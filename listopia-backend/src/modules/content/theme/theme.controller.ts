import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/RolesGuard/roles.guard';

import { ThemeService } from '@modules/content/theme/theme.service';
import type { CreateThemeType } from '@modules/content/theme/types/createTheme.type';
import type { UpdateThemeType } from '@modules/content/theme/types/updateTheme.type';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

@Controller('theme')
export class ThemeController {
  constructor(private readonly themeService: ThemeService) {}

  @UseGuards(RolesGuard)
  @Roles('admin', 'developer', 'editor')
  @Post()
  async createTheme(@Body() createThemeData: CreateThemeType) {
    return this.themeService.createTheme(createThemeData);
  }

  @UseGuards(RolesGuard)
  @Roles('admin', 'developer', 'editor')
  @Put(':id')
  async updateTheme(
    @Body() updateThemeData: UpdateThemeType,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.themeService.updateTheme({ ...updateThemeData, id: id });
  }

  @UseGuards(RolesGuard)
  @Roles('admin', 'developer', 'editor')
  @Delete(':id')
  async deleteTheme(@Param('id', ParseIntPipe) id: number) {
    return this.themeService.deleteTheme(id);
  }

  @Get()
  async getAllThemes() {
    return this.themeService.getAllThemes();
  }
}
