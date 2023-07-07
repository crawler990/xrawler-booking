import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import * as moment from 'moment';
import { BookingsService } from 'src/bookings/bookings.service';

@Injectable()
export class ReportsService {
    constructor(
        private bookingService : BookingsService
    ){}

    async generateReport(userId){
        const browser = await puppeteer.launch({headless: 'new'});
        const page = await browser.newPage();
        const bookings: any = await this.bookingService.getUserBookings(userId)
        console.log(bookings)

        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/coreui/3.4.0/css/coreui.min.css">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/coreui/3.4.0/js/coreui.bundle.min.js"></script>
        <title>Booking List</title>
        </head>
        <body>
        <div class="card">
            <table class="table">
            <thead>
                <tr>
                <th>Facility</th>
                <th>Times</th>
                <th>Total Cost</th>
                </tr>
            </thead>
            <tbody>
                ${bookings.length > 0 ?
                bookings.map(booking => `
                    <tr>
                    <td>${booking.facility.name}</td>
                    <td>
                        <ul class="list-group" style="width: 100px;">
                        ${booking.dates.map(date => `
                            <li class="list-group-item">
                            ${moment(date.start).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(date.end).format('MMMM Do YYYY, h:mm:ss a')}
                            </li>
                        `).join('')}
                        </ul>
                    </td>
                    <td><strong>${booking.subTotal}</strong></td>
                    <td>
                        <i class="cil-trash" style="cursor: pointer;"></i>
                    </td>
                    </tr>
                `).join('') :
                `<tr><td colspan="4">No bookings available</td></tr>`
                }
            </tbody>
            </table>
        </div>
        </body>
        </html>
        `;

        await page.setContent(htmlContent);
        const pdf = await page.pdf({ path: 'result.pdf', format: 'letter'});

        await page.close()
        await browser.close()

        return pdf;
    }
}
