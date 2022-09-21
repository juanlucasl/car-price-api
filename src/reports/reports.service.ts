import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from '../users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private repository: Repository<Report>,
  ) {}

  /**
   * Creates a new report with the given details.
   *
   * @param reportDto- Report data.
   * @param user- User creating the report.
   * @returns Newly created report.
   */
  create(reportDto: CreateReportDto, user: User) {
    const newReport = this.repository.create(reportDto);
    newReport.user = user;

    return this.repository.save(newReport);
  }

  /**
   * Given the id of a report, changes its current approval status.
   *
   * @param id - Report id.
   * @param approved - Approval data. It should have a boolean 'approved' property.
   * @returns The updated report.
   */
  async changeApproval(id: string, approved: boolean) {
    const report = await this.repository.findOneBy({ id: parseInt(id) });

    if (!report) throw new NotFoundException('Report not found');

    report.approved = approved;

    return this.repository.save(report);
  }

  /**
   * Get an estimate for a car with the given details.
   *
   * @param GetEstimateDto The car details.
   * @returns The estimated value for the car.
   */
  getEstimate({
    make,
    model,
    year,
    kilometers,
    longitude,
    latitude,
  }: GetEstimateDto) {
    return this.repository
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('longitude - :longitude BETWEEN -5 AND 5', { longitude })
      .andWhere('latitude - :latitude BETWEEN -5 AND 5', { latitude })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(kilometers - :kilometers)', 'DESC')
      .setParameters({ kilometers })
      .limit(3)
      .getRawOne<number>();
  }
}
