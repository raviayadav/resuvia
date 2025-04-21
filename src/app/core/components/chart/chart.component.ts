import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  imports: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class AppChart implements AfterViewInit {
  @ViewChild('doughnutCanvas') doughnutCanvas!: ElementRef;

  percentage = 72;

  ngAfterViewInit(): void {
    new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: [],
        datasets: [
          {
            // Foreground progress ring (green) — drawn on top
            data: [this.percentage, 100 - this.percentage],
            backgroundColor: ['#6AC430', 'transparent'],
            borderWidth: 0,
            borderRadius: 20,
          }
        ]
      },
      options: {
        cutout: '70%',
        responsive: true,
        rotation: 90,
        circumference: 360,
        plugins: {

          legend: { display: false },
          tooltip: { enabled: false }
        },
      },
      plugins: [{
        id: "doughnutCanvas",
        beforeDraw: (chart: any) => {
          const { ctx, data, options } = chart;
          const x= chart.getDatasetMeta(0).data[0].x;
          const y= chart.getDatasetMeta(0).data[0].y;

          const outerRadius = chart.getDatasetMeta(0).data[0].outerRadius;
          const innerRadius = chart.getDatasetMeta(0).data[0].innerRadius;

          ctx.save();
          ctx.translate(x, y);
          ctx.beginPath();
          ctx.fillStyle = '#D9D9D9';
          ctx.arc(0, 0, outerRadius, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.fillStyle = '#ffffff';
          ctx.arc(0, 0, innerRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }]
    });
  }
}




















// import { AfterViewInit, Component } from '@angular/core';
// import Chart from 'chart.js/auto';

// @Component({
//   selector: 'app-chart',
//   imports: [],
//   templateUrl: './chart.component.html',
//   styleUrl: './chart.component.scss'
// })
// export class ChartComponent {



  
  
//   // value = 75;
//   // data = {
//   //   labels: [
//   //   ],
//   //   datasets: [
//   //     {
//   //       data: [this.value, 100-this.value],
//   //       backgroundColor: [
//   //         "#6FC027",
//   //         "#D9D9D9"
//   //       ],
//   //       hoverBackgroundColor: [
//   //         "#6FC027",
//   //         "#D9D9D9"
//   //       ],
//   //       hoverBorderColor: [ 
//   //         "#6FC027",
//   //         "#D9D9D9"]

//   //     }]
//   // };

//   // ngAfterViewInit(): void {
//   //   // this.loadChart();
//   // }

//   // loadChart() {
//   //   const ctx = document.getElementById('myChart') as HTMLCanvasElement;
//   //   const myChart = new Chart(ctx, {
//   //     type: 'doughnut',
//   //     data: this.data,
//   //     options: {
//   //       hover: {
//   //         mode: 'nearest',},
//   //       datasets:{
//   //         doughnut: {
//   //           borderRadius: 60,
//   //           borderWidth: 15,
//   //           backgroundColor: [
//   //             "#6FC027",
//   //             "#D9D9D9"],
//   //           hoverBorderColor: [ "#6FC027",
//   //             "#D9D9D9"],
//   //         }

//   //       },
//   //       responsive: true,
//   //       plugins: {
//   //         legend: {
//   //           display: false
//   //         },
//   //         tooltip: {
//   //           callbacks: {
//   //             label: function(item) {
//   //               const label = item.label;
//   //               return label ? label : '';
//   //             }
//   //           }
//   //         }
//   //       },
//   //   }})    
//   // this.textCenter(this.value);
//   // }

//   // textCenter(val: number) {
//   //   Chart.register({
//   //     id: 'textCenter',
//   //     beforeDraw: function(chart: any) {
//   //       const { width, height, ctx } = chart;
  
//   //       ctx.save();
//   //       const fontSize = (height / 114).toFixed(2);
//   //       ctx.font = fontSize + "em sans-serif";
//   //       ctx.textBaseline = "middle";
  
//   //       const text = val + "%",
//   //             textX = Math.round((width - ctx.measureText(text).width) / 2),
//   //             textY = height / 2;
  
//   //       ctx.fillText(text, textX, textY);
//   //       ctx.restore();
//   //     }
//   //   });
//   // }
// }
