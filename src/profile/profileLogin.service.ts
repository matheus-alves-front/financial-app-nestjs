import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class ProfileLoginService {
  constructor(
    private prisma: PrismaService,
  ){}

  async login(userName: string) {
    const profile = await this.prisma.profile.findUnique({
      where: {
        name: userName
      }
    })

    return profile || false
  }
}