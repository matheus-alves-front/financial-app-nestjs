import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

interface dateFormat {
  day: number
  month: number
  year: number
}

@Injectable()
export class DateService {
  getDate(): dateFormat {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear()

    return {
      day,
      month,
      year
    }
  }
}