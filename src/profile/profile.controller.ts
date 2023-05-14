import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Profile } from '@prisma/client';
import { ProfileLoginService } from './profileLogin.service';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private profileLogin: ProfileLoginService
  ) {}

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
  async remove(@Param('id') id: string) {
    const idNumber = Number(id)

    return await this.profileService.remove(idNumber);
  }

  @Post('/login/')
  async login(@Body() userLogin: Profile) {
    const { name, password } = userLogin
    const profile = await this.profileLogin.login(name)

    if (!profile) return {message: 'Usuário Não Existe'}

    if (profile.password === password) return profile 
    
    return {message: 'Senha Errada'}
  }
}
