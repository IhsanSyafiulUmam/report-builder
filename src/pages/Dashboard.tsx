import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Clock,
  Plus,
  Eye,
  Edit3
} from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import RecentActivity from '../components/dashboard/RecentActivity';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Clients',
      value: '24',
      change: '+2 this month',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Reports',
      value: '156',
      change: '+12 this week',
      trend: 'up',
      icon: FileText,
      color: 'emerald'
    },
    {
      title: 'Reports Generated',
      value: '1,247',
      change: '+89 this month',
      trend: 'up',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      title: 'Pending Reviews',
      value: '8',
      change: '-3 from yesterday',
      trend: 'down',
      icon: Clock,
      color: 'orange'
    }
  ];

  const recentReports = [
    {
      id: '1',
      client: 'Brand Alpha',
      title: 'Q4 2024 Performance Report',
      status: 'completed',
      lastUpdated: '2 hours ago',
      pages: 24
    },
    {
      id: '2',
      client: 'Brand Beta',
      title: 'Marketing Campaign Analysis',
      status: 'in_progress',
      lastUpdated: '5 hours ago',
      pages: 18
    },
    {
      id: '3',
      client: 'Brand Gamma',
      title: 'Customer Behavior Insights',
      status: 'review',
      lastUpdated: '1 day ago',
      pages: 22
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your report overview.</p>
        </div>
        <Link
          to="/reports/builder"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus size={20} className="mr-2" />
          New Report
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Reports */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {recentReports.map((report) => (
                <div key={report.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-gray-900">{report.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          report.status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : report.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {report.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{report.client}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                        <span>{report.pages} pages</span>
                        <span>Updated {report.lastUpdated}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                        <Edit3 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-gray-200">
              <Link 
                to="/reports" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View all reports →
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;