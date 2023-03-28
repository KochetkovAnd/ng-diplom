import { Component, Input, ViewChild } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { User } from 'src/app/models/user';
import { lastValueFrom } from 'rxjs';
import { HttpService } from 'src/app/services/http-service/http.service';
@Component({
  selector: 'pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent {

  constructor(
    private httpService: HttpService
  ) { }

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  @Input() user: User | undefined
  @Input() max: number = 0

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      datalabels: {
        formatter: (value, ctx) => {
          if (ctx.chart.data.labels) {
            return ctx.chart.data.labels[ctx.dataIndex];
          }
        },
      },
    }
  }

  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ["Не сделанные", "На проверке", "Проверенные"],
    datasets: [{
      data: []
    }]
  }

  public pieChartType: ChartType = 'pie'
  public pieChartPlugins = [DatalabelsPlugin]

  async ngOnInit() {
    if (this.user) {
      let checked = 0
      let notChecked = 0
      let userTasks = await lastValueFrom(this.httpService.getAllUserTaskByUser(this.user))
      userTasks.forEach(userTask => {
        if (userTask.solution != "") {
          this.max--
          if (userTask.mark != 0) {
            checked++
          } else {
            notChecked++
          }
        }
      })
      this.pieChartData.datasets[0].data.push(this.max)
      this.pieChartData.datasets[0].data.push(notChecked)
      this.pieChartData.datasets[0].data.push(checked)
      this.chart?.update()
    }
  }
}
