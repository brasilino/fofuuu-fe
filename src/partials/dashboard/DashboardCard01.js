import React, { useEffect, useState } from 'react'
import BarChart from '../../charts/BarChart01'
import { URL, profileId } from './DashboardConfig'
import FilterButton from '../actions/FilterButton'
// import ReactLoading from "react-loading";

// Import utilities
import { tailwindConfig } from '../../utils/Utils'

import {
  ApolloClient,
  InMemoryCache,
  gql
} from "@apollo/client"


function DashboardCard01() {

  const [value, setValue] = useState(false)
  const [chartData, setChartData] = useState({})
  // const [reactLoading, setReactLoading] = useState({ display: 'none' })
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
    if(filters && filters.pathology) return `chapter: "${filtersDefault.chapter}", pathology: "${filters.pathology}"` 
    if(!filters || !filters.all) return `chapter: "${filtersDefault.chapter}", profileId: "${profileId}"` 
    return `chapter: "${filtersDefault.chapter}"` 
  }

  const getQuery = async (filters) => {
    const params = prepareParams(filters)
    const result = await client.query({
      query: gql`
        query {
          getScoreByGame(${params}) {
            ModuleId
            Score
          }
        }
      `
    })

    const { data: { getScoreByGame } } = result
    
    if(getScoreByGame && getScoreByGame.length > 0) {
      const score = getScoreByGame.map(item => item.Score)
      const moduleId = getScoreByGame.map(item => item.ModuleId)

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
  }

  useEffect(() => {
    async function fetchData() {

      await getQuery()

      setValue(false)
    }
    fetchData()
    // eslint-disable-next-line 
  }, [value])

  const applyFilters = async (filters) => {
    // setChartData({})
    // setReactLoading({ display: 'block' })
    await getQuery(filters)
  }

  return ( 
    <div className="flex flex-col col-span-full sm:col-span-12 bg-white shadow-lg rounded-sm border border-gray-200">
      <header className="px-5 py-4 border-b border-gray-100">
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          <div className="flex flex-wrap justify-center sm:justify-start mb-8 sm:mb-0 -space-x-3 -ml-px">
            <h2 className="font-semibold text-gray-800">Pontuação de jogo por Aluno</h2>
          </div>
          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
            <FilterButton applyFilters={applyFilters} />
          </div>
        </div>
      </header>
      {/* Chart built with Chart.js 3 */}
      {/* Change the height attribute to adjust the chart height */}
      <BarChart data={chartData} width={595} height={248} />

      {/* <div className="center-element">
        <ReactLoading type="bubbles" color="#000" style={reactLoading} />
      </div> */}

    </div>
  );

}

export default DashboardCard01;
