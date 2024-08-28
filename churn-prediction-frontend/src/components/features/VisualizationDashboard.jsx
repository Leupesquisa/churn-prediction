import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import { VictoryBoxPlot, VictoryChart, VictoryAxis, VictoryTheme } from 'victory';
import customerService from '../../services/CustomerServices';
import './VisualizationDashboard.css';
import ROCCurveChart from './../charts/ROCCurveChart';
import ConfusionMatrix from './../charts/ConfusionMatrixChart';



const VisualizationDashboard = () => {
  const chartRefs = useRef([]);
  const chartInstances = useRef([]);
  const [data, setData] = useState(null);

  const createChart = (ctx, config) => {
    if (chartInstances.current[ctx.canvas.id]) {
      chartInstances.current[ctx.canvas.id].destroy();
    }
    chartInstances.current[ctx.canvas.id] = new Chart(ctx, config);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await customerService.getChurnStatistics(); // Busca os dados da API
        setData(responseData);

        // Apenas crie os gráficos se os dados existirem
        if (responseData) {
          // Gráfico 1: Churn Count
          const ctx1 = chartRefs.current[0].getContext('2d');
          createChart(ctx1, {
            type: 'bar',
            data: {
              labels: ['Yes', 'No'],
              datasets: [{
                label: 'Churn Count',
                data: [responseData.churnYesCount, responseData.churnNoCount],
                backgroundColor: ['rgba(0, 99, 132, 0.2)', 'rgba(100, 150, 235, 0.2)'],
                borderColor: ['rgba(0, 99, 132, 1)', 'rgba(100, 150, 235, 1)'],
                borderWidth: 1
              }]
            },
            options: {
              scales: {
                y: { beginAtZero: true, ticks: { color: '#FFFFFF' } },
                x: { ticks: { color: '#FFFFFF' } }
              },
              plugins: {
                legend: { labels: { color: '#FFFFFF' } }
              },
              barPercentage: 0.25
            }
          });

          // Gráfico 2: Gender-wise Churn
          const ctx2 = chartRefs.current[1].getContext('2d');
          createChart(ctx2, {
            type: 'bar',
            data: {
              labels: ['Male', 'Female'],
              datasets: [{
                label: 'Gender-wise Churn',
                data: [responseData.maleChurnCount, responseData.femaleChurnCount],
                backgroundColor: ['#36A2EB', '#FF6384'],
                borderColor: ['#36A2EB', '#FF6384'],
                borderWidth: 1
              }]
            },
            options: {
              scales: { y: { beginAtZero: true } }, barPercentage: 0.25
            },
            
          });

          // Gráfico 3: Contract Type Churn
          const ctx3 = chartRefs.current[2].getContext('2d');
          createChart(ctx3, {
            type: 'bar',
            data: {
              labels: responseData.contractTypes,
              datasets: [{
                label: 'Contract Type Churn',
                data: responseData.contractChurnCounts,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
              }]
            },
            options: {
              scales: { y: { beginAtZero: true } },  barPercentage: 0.25
            },
           
          });

          // Gráfico 4: Monthly Charges
          const ctx4 = chartRefs.current[3].getContext('2d');
          createChart(ctx4, {
            type: 'bar',
            data: {
              labels: ['Without Churn', 'With Churn'],
              datasets: [{
                label: 'Monthly Charges',
                data: [responseData.noChurnMonthlyCharges, responseData.yesChurnMonthlyCharges],
                backgroundColor: ['#4BC0C0', '#FFCE56'],
                borderColor: ['#4BC0C0', '#FFCE56'],
                borderWidth: 1
              }]
            },
            options: {
              scales: { y: { beginAtZero: true } },  barPercentage: 0.25
            }
          });

                
        }

      } catch (error) {
        console.error('Failed to fetch chart data', error);
      }
    };

    fetchData();

    return () => {
      chartInstances.current.forEach((chart) => {
        if (chart) {
          chart.destroy();
        }
      });
    };
  }, []);

  return (
    <div className="dashboard-container">
      <h3 className="dashboard-title">Data Analysis</h3>
      <div className="chart-grid">
        <div className="chart-paper">
          <canvas id="chart0" ref={el => chartRefs.current[0] = el} className="chart-item"></canvas>
        </div>
        <div className="chart-paper">
          <canvas id="chart1" ref={el => chartRefs.current[1] = el} className="chart-item"></canvas>
        </div>
        <div className="chart-paper">
          <canvas id="chart2" ref={el => chartRefs.current[2] = el} className="chart-item"></canvas>
        </div>
        <div className="chart-paper">
          <canvas id="chart3" ref={el => chartRefs.current[3] = el} className="chart-item"></canvas>
        </div>
          {/* Gráfico 5: Confusion Matrix */}
          
            <div className="chart-paper">
             <ConfusionMatrix />
            </div>
         
        <div className="chart-paper">
        <ROCCurveChart />
        </div>
      </div>
    </div>
  );
};

export default VisualizationDashboard;
