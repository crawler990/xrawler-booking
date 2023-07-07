import { Controller, Get } from '@nestjs/common';
import { GetUser } from 'src/common/user.decorator';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
    constructor(
        private reportService: ReportsService
    ){}

    @Get()
    async generateReport(@GetUser()userId){
        return await this.reportService.generateReport(userId)
    }
}
