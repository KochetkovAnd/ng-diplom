import { Component, Input, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { Group } from 'src/app/models/group';
import { lastValueFrom } from 'rxjs';
import { HttpService } from 'src/app/services/http-service/http.service';
@Component({
  selector: 'main-chart',
  templateUrl: './main-chart.component.html',
  styleUrls: ['./main-chart.component.css']
})
export class MainChartComponent {

  constructor(
    private httpService: HttpService
  ) { }

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  @Input() id: number = 0



  async ngOnInit() {
    let checked: number[] = []
    let notChecked: number[] = []
    let labels: string[] = []

    let users = await lastValueFrom(this.httpService.getUsersByGroupId(this.id))    
    for (let i = 0; i < users.length; i++) {
      labels.push(users[i].name)

      let c: number = 0
      let n: number = 0

      let userTasks = await lastValueFrom(this.httpService.getAllUserTaskByUser(users[i]))
      userTasks.forEach(userTask => {
        if (userTask.solution != "") {
          if (userTask.mark != 0) {
            c++
          } else {
            n++
          }
        }
      })
      checked.push(c)
      notChecked.push(n)
    }
    
    this.barChartData.labels = labels
    this.barChartData.datasets[0].data = checked
    this.barChartData.datasets[1].data = notChecked
    this.chart?.update()
  }

  public barChartOptions: ChartConfiguration['options'] = {
    scales: {
      x: {
        stacked: true
      },
      y: {
        stacked: true
      },

    },
    plugins: {
      legend: {
        display: true
      },
      datalabels: {
        anchor: 'end',
        align: 'end'
      }
    }
  }
  public barChartType: ChartType = 'bar'
  public barChartPlugins = [
    DataLabelsPlugin
  ]

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Проверенные', backgroundColor: "#00FF3D" },
      { data: [], label: 'Не проверенные', backgroundColor: "#F2EA00" }
    ]
  }
}
