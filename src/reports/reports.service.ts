import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from '../users/user.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private repository: Repository<Report>,
  ) {}

  create(reportDto: CreateReportDto, user: User) {
    const newReport = this.repository.create(reportDto);
    newReport.user = user;

    return this.repository.save(newReport);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.repository.findOneBy({ id: parseInt(id) });

    if (!report) throw new NotFoundException('Report not found');

    report.approved = approved;

    return this.repository.save(report);
  }
}
