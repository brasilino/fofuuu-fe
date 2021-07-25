import React, { useState } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';
import DashboardCard01 from '../partials/dashboard/DashboardCard01';
import DashboardCard02 from '../partials/dashboard/DashboardCard02';
import DashboardCard03 from '../partials/dashboard/DashboardCard03';
import {
  ApolloClient,
  InMemoryCache,
  gql
} from "@apollo/client"
import { URL } from '../partials/dashboard/DashboardConfig'


function Dashboard() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const client = new ApolloClient({
    uri: URL,
    cache: new InMemoryCache()
  });

  const getFilters = async () => {
    const result = await client.query({
      query: gql`
        query {
          getChapter {
            Description
          }
          getPathology {
            Description
          }
        }
      `
    })

    const { data: { getChapter, getPathology } } = result

    let filters = {
      chapter: [],
      pathology: []
    }

    if(getChapter && getChapter.length > 0) {
      filters.chapter = getChapter.map(item => item.Description)
      filters.pathology = getPathology.map(item => item.Description)
    }

    return filters
  }

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

            {/* Welcome banner */}
            <WelcomeBanner />

            {/* Cards */}
            <div className="grid grid-cols-12 gap-12">

              {/* Bar chart (Direct vs Indirect) */}
              <DashboardCard01 getFilters={getFilters} />
              <DashboardCard02 getFilters={getFilters} />
              <DashboardCard03 getFilters={getFilters} />

            </div>
          </div>
        </main>

      </div>
    </div>
  );
}

export default Dashboard;