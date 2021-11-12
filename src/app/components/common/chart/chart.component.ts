import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from "highcharts";

import More from "highcharts/highcharts-more";
More(Highcharts);

import highcharts3D from "highcharts/highcharts-3d";
highcharts3D(Highcharts);

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  @Input() options: object = {};
  @Input() title: string = "";

  highcharts = Highcharts;

  configOptions = {
    chart: {
      height: 350,
      parallelAxes: {
        margin: 20
      }
    },
    credits: {
      enabled: false
    },
    title: {
      text: ""
    },
    legend: {
      enabled: true,
      verticalAlign: "top",
      layout: 'vertical',
      align: 'right',      
      width: '40%'
    },
    plotOptions: {
      pie: {
        shadow: false,
        center: ['50%', '50%'],
        dataLabels: {
          enabled: true,
          distance: -50,
          style: {
            fontWeight: 'bold',
            color: 'white',
            textOutline: 0
          },
          formatter: function () {
            return this.y > 5 ? this.y + '%' : null;
          },
        },
        showInLegend: true
      }
    }, 
  }

  constructor() { }

  ngOnInit() {
    this.options = {
      ...this.configOptions,
      ...this.options
    }    
  }

}
