import React, { useEffect, useState } from 'react';
import BarChart from '../../charts/BarChart01';

// Import utilities
import { tailwindConfig } from '../../utils/Utils';

import {
  ApolloClient,
  InMemoryCache,
  gql
} from "@apollo/client";


function DashboardCard02() {

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
                getErrorCountByGameByStudent(profileId: "cd465e22-8384-4a88-a7e0-113c27b43f70") {
                    ProfileId
                    ModuleId
                    TotalErrors
                }
            }
        `
        })

        const { data: { getErrorCountByGameByStudent } } = result
        
        if(getErrorCountByGameByStudent && getErrorCountByGameByStudent.length > 0) {
            const totalErrors = getErrorCountByGameByStudent.map(item => item.TotalErrors)
            const moduleId = getErrorCountByGameByStudent.map(item => item.ModuleId)

            console.log('totalErrors', totalErrors)

            setChartData({
                labels: moduleId,
                datasets: [
                  // Light blue bars
                  {
                    label: 'Direct',
                    data: totalErrors,
                    backgroundColor: tailwindConfig().theme.colors.red[400],
                    hoverBackgroundColor: tailwindConfig().theme.colors.red[500],
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
        <h2 className="font-semibold text-gray-800">Total de erros do aluno por jogo</h2>
      </header>
      {/* Chart built with Chart.js 3 */}
      {/* Change the height attribute to adjust the chart height */}
      <BarChart data={chartData} width={595} height={248} />
    </div>
  );

}

export default DashboardCard02;
