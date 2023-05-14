import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Profile } from '@prisma/client';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  create(@Body() profileData: Profile) {
    return this.profileService.create(profileData);
  }

  @Get()
  findAll() {
    return this.profileService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const idNumber = Number(id)

    const profile = await this.profileService.findOne(idNumber) 

    return profile || 'Usuário Não Existe';
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    const idNumber = Number(id)

    return this.profileService.remove(idNumber);
  }
}
