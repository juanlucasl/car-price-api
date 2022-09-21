import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { CreateReportDto } from './dtos/create-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { ReportDto } from './dtos/report.dto';
import { AdminGuard } from '../guards/admin.guard';
import { AuthGuard } from '../guards/auth.guard';
import { Serialize } from '../interceptors/serialize.interceptor';
import { User } from '../users/user.entity';
import { CurrentUser } from '../users/decorators/current-user.decorator';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  /**
   * Creates a new report with the given details.
   * Only signed-in users can do this.
   *
   * @param body - Report data.
   * @param user - User creating the report.
   * @returns Newly created report.
   */
  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }

  /**
   * Given the id of a report, changes its current approval status.
   * Only users with admin rights can do this.
   *
   * @param id - Report id.
   * @param body - Approval data. It should have a boolean 'approved' property.
   * @returns The updated report.
   */
  @Patch('/:id')
  @UseGuards(AdminGuard)
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return this.reportsService.changeApproval(id, body.approved);
  }

  /**
   * Get an estimate for a car with the given details.
   *
   * @param query - Car details.
   * @returns The estimated value for the car.
   */
  @Get()
  getEstimate(@Query() query: GetEstimateDto) {
    return this.reportsService.getEstimate(query);
  }
}
