import { Injectable } from '@nestjs/common';
import { Profile } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaRelations } from 'src/prisma/relations.service';

@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService,
    private prismaRelations: PrismaRelations
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
    
    return profile || false;
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

  async remove(id: number) {
    const userData = await this.prismaRelations.findAllDataFromProfile(id) 
    
    const expensesId = userData.map(({expense}) => expense.id)
    const monthsId = userData.map(({month}) => month.id)
    
    const uniqueExpensesId = expensesId.filter((value, index, self) => {
      return self.indexOf(value) === index
    })
    
    const uniqueMonthsId = monthsId.filter((value, index, self) => {
      return self.indexOf(value) === index
    })
    
    
    await this.prisma.profile.delete({
      where: {
        id
      }
    })

    await this.prisma.expense.deleteMany({
      where: {
        id: {
          in: uniqueExpensesId
        }
      }
    })

    await this.prisma.month.deleteMany({
      where: {
        id: {
          in: uniqueMonthsId
        }
      }
    })

    return 'Usuário removido';
  }
}
