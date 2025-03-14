import { Controller, Get } from '@nestjs/common';
import { KpiService } from './kpi.service';

@Controller('kpi')
export class KpiController {
  constructor(private readonly kpiService: KpiService) {}

  @Get('/get-kpi')
  async getPostKpi() {
    const [
      usersNumber,
      allPostStatus,
      allLocalitiesNumber,
      allPostByMonthPerYear,
    ] = await Promise.all([
      this.kpiService.getAllUsers(),
      this.kpiService.getAllStatusPost(),
      this.kpiService.getAllAgglomerationInfo(),
      this.kpiService.getPostsByYear(),
    ]);

    return {
      code: 200,
      message: 'Kpi info',
      data: {
        usersNumber,
        allLocalitiesNumber,
        allPostStatus,
        allPostByMonthPerYear,
      },
    };
  }
}
