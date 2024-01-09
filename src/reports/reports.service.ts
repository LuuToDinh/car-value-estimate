import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { User } from '../users/user.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;

    return this.repo.save(report);
  }
  async changeApproval(id: string, approved: boolean) {
    const report = await this.repo.findOne({ where: { id: parseInt(id) } });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    report.approved = approved;
    return this.repo.save(report);
  }

  createEstimate({ make, model, mileage, lng, lat, year }: GetEstimateDto) {
    return (
      this.repo
        .createQueryBuilder()
        // Return average prive finally
        .select('AVG(price)', 'price')
        // Column make = :make value get from { make }
        .where('make = :make', { make })
        // andWhere if where will be overrided
        .andWhere('model = :model', { model })
        // From lng - 5 -> lng + 5
        .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
        .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
        .andWhere('year = :year BETWEEN -3 AND 3', { year })
        // Column approve = true
        .andWhere('approved IS TRUE')
        // Nearest mileage value
        .orderBy('mileage - :mileage', 'DESC')
        .setParameters({ mileage })
        // Get 3 rows only
        .limit(3)
        .getRawMany()
    );
  }
}
