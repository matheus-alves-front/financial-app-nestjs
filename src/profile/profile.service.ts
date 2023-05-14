import { Injectable } from '@nestjs/common';
import { Profile } from '@prisma/client';
import { MonthsService } from 'src/months/months.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService
  ) {}

  async create(profileData: Profile) {
    const profileCreate = await this.prisma.profile.create({
      data: profileData
    }) 

    return profileCreate;
  }

  async findAll() {
    const profiles = await this.prisma.profile.findMany() 

    return profiles;
  }

  async findOne(id: number) {
    const profile = await this.prisma.profile.findUnique({
      where: {
        id
      }
    }) 
    
    return profile || 'Usuário Não existe';
  }

  async updatePassword(id: number, newPassword: string) {
    const {
      name
    } = await this.prisma.profile.findUnique({
      where: {
        id
      }
    })

    const profileUpdate = await this.prisma.profile.update({
      where: {
        id
      },
      data: {
        name,
        password: newPassword
      }
    })

    return profileUpdate;
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
