import React, { useEffect, useState } from 'react';
import BarChart from '../../charts/BarChart01';

// Import utilities
import { tailwindConfig } from '../../utils/Utils';

import {
  ApolloClient,
  InMemoryCache,
  gql
} from "@apollo/client";


function DashboardCard01() {

  const [value, setValue] = useState(false)
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    async function fetchData() {
      const client = new ApolloClient({
        uri: 'http://localhost:4000',
        cache: new InMemoryCache()
      });

      const result = await client.query({
        query: gql`
          query {
            getScoreByGameByStudent(profileId: "cd465e22-8384-4a88-a7e0-113c27b43f70") {
              ProfileId
              ModuleId
              Score
            }
          }
        `
      })

      const { data: { getScoreByGameByStudent } } = result
      
      if(getScoreByGameByStudent && getScoreByGameByStudent.length > 0) {
        const score = getScoreByGameByStudent.map(item => item.Score)
        const moduleId = getScoreByGameByStudent.map(item => item.ModuleId)

        setChartData({
          labels: moduleId,
          datasets: [
            // Light blue bars
            {
              label: 'Direct',
              data: score,
              backgroundColor: tailwindConfig().theme.colors.yellow[400],
              hoverBackgroundColor: tailwindConfig().theme.colors.yellow[500],
              barPercentage: 0.66,
              categoryPercentage: 0.66,
            },
          ],
        })  
      }

      setValue(false)
    }
    fetchData();
  }, [value]);


  return ( 
    <div className="flex flex-col col-span-full sm:col-span-12 bg-white shadow-lg rounded-sm border border-gray-200">
      <header className="px-5 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-800">Pontuação de jogo por Aluno</h2>
      </header>
      {/* Chart built with Chart.js 3 */}
      {/* Change the height attribute to adjust the chart height */}
      <BarChart data={chartData} width={595} height={248} />
    </div>
  );

}

export default DashboardCard01;
