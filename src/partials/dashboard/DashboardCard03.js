import React, { useEffect, useState } from 'react'
import BarChart from '../../charts/BarChart01'
import { URL, profileId } from './DashboardConfig'
import FilterButton from '../actions/FilterButton'
import ReactLoading from 'react-loading'

// Import utilities
import { tailwindConfig } from '../../utils/Utils'

import {
  ApolloClient,
  InMemoryCache,
  gql
} from "@apollo/client";


function DashboardCard02() {

  const [value, setValue] = useState(false)
  const [chartData, setChartData] = useState({});
  const [reactLoading, setReactLoading] = useState(true)
  const filtersDefault = {
    all: false,
    chapter: 'activities-alphabet',
    pathology: ''
  }

  const client = new ApolloClient({
    uri: URL,
    cache: new InMemoryCache()
  });

  const prepareParams = (filters) => {
    if(!filters) filters = filtersDefault
    if(filters.pathology) return `chapter: "${filters.chapter}", pathology: "${filters.pathology}"` 
    if(!filters.all) return `chapter: "${filters.chapter}", profileId: "${profileId}"` 
    return `chapter: "${filters.chapter}"` 
  }

  const getQuery = async (filters) => {
    const params = prepareParams(filters)
    const result = await client.query({
      query: gql`
        query {
          getErrorCountByGame(${params}) {
            ModuleId
            TotalErrors
          }
        }
      `
    })

    const { data: { getErrorCountByGame } } = result
        
    if(getErrorCountByGame && getErrorCountByGame.length > 0) {
        const totalErrors = getErrorCountByGame.map(item => item.TotalErrors)
        const moduleId = getErrorCountByGame.map(item => item.ModuleId)

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
        setReactLoading(false)  
    }
  }

  useEffect(() => {
    async function fetchData() {

      await getQuery()

      setValue(false)
    }
    fetchData()
    // eslint-disable-next-line 
  }, [value]);

  const applyFilters = async (filters) => {
    setChartData({})
    setReactLoading(true)
    await getQuery(filters)
  }

  return ( 
    <div className="flex flex-col col-span-full sm:col-span-12 bg-white shadow-lg rounded-sm border border-gray-200 relative">
      <header className="px-5 py-4 border-b border-gray-100">
        <div className="flex flex-wrap justify-center sm:justify-start mb-8 sm:mb-0 -space-x-3 -ml-px">
            <h2 className="font-semibold text-gray-800">Total de erros do aluno por jogo</h2>
          </div>
          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
            <FilterButton applyFilters={applyFilters} />
          </div>
      </header>
      {/* Chart built with Chart.js 3 */}
      {/* Change the height attribute to adjust the chart height */}
      <BarChart data={chartData} width={595} height={248} />

      <div className="center-element">
        <ReactLoading 
          type="bubbles"
          color={tailwindConfig().theme.colors.red[400]}
          className={reactLoading ? '' : 'hide-element'} />
      </div>
    </div>
  );

}

export default DashboardCard02;
