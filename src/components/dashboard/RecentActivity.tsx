import React from 'react';
import { Clock, User, FileText, Eye } from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    {
      id: '1',
      type: 'report_created',
      user: 'John Doe',
      action: 'created a new report',
      target: 'Q4 Performance Analysis',
      time: '2 hours ago',
      icon: FileText,
      color: 'blue'
    },
    {
      id: '2',
      type: 'report_viewed',
      user: 'Sarah Smith',
      action: 'viewed report',
      target: 'Marketing Campaign ROI',
      time: '4 hours ago',
      icon: Eye,
      color: 'green'
    },
    {
      id: '3',
      type: 'client_added',
      user: 'Mike Johnson',
      action: 'added new client',
      target: 'Brand Epsilon',
      time: '6 hours ago',
      icon: User,
      color: 'purple'
    },
    {
      id: '4',
      type: 'report_updated',
      user: 'Lisa Wilson',
      action: 'updated report',
      target: 'Customer Insights Q3',
      time: '8 hours ago',
      icon: FileText,
      color: 'orange'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="px-6 py-4">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${getColorClasses(activity.color)}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span>{' '}
                    {activity.action}{' '}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <Clock size={12} className="mr-1" />
                    {activity.time}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="px-6 py-4 border-t border-gray-200">
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View all activity →
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;