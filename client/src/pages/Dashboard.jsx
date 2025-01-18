import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnalytics } from "../store/slices/analyticsSlice";
import { fetchUsers } from "../store/slices/usersSlice";
import { fetchActivityLogs } from "../store/slices/activitySlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import { Users, Eye, UserCheck, Activity } from "lucide-react";

import PropTypes from "prop-types";
import { Loader } from "@/components/Loader";
import { format } from "date-fns";

const StatCard = ({ title, value, icon: Icon, description }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
        <div className="p-3 bg-primary/10 rounded-full">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { data: analytics, loading } = useSelector((state) => state.analytics);

  const users = useSelector((state) => state.users.users);
  const recentActivity = useSelector((state) => state.activity);

  useEffect(() => {
    dispatch(
      fetchAnalytics({ startDate: "2025-01-10", endDate: "2025-01-19" })
    );
    dispatch(fetchUsers());
    dispatch(
      fetchActivityLogs({ startDate: "2025-01-10", endDate: "2025-01-18" })
    );
  }, [dispatch]);

  const dailyActiveUsers = analytics?.reduce(
    (sum, entry) => sum + entry.dailyActiveUsers,
    0
  );

  const dailyUniqueVisitors = analytics?.reduce(
    (sum, entry) => sum + entry.uniqueVisitors,
    0
  );
  const formattedAnalysis = useMemo(
    () =>
      analytics?.map((entry) => {
        return {
          date: format(new Date(entry.date), "dd/MM/yyyy"),
          visitors: entry.uniqueVisitors,
          pageViews: entry.pageViews,
        };
      }),
    [analytics]
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={users.length}
          icon={Users}
          description="All registered users"
        />
        <StatCard
          title="Daily Active Users"
          value={dailyActiveUsers || 0}
          icon={UserCheck}
          description="Last 24 hours"
        />
        <StatCard
          title="Page Views"
          value={recentActivity?.logs.length || 0}
          icon={Eye}
          description="Today"
        />
        <StatCard
          title="Unique Visitors"
          value={dailyUniqueVisitors || 0}
          icon={Activity}
          description="Current"
        />
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>User Activity Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedAnalysis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  stroke="#2563eb"
                  name="Visitors"
                />
                <Line
                  type="monotone"
                  dataKey="pageViews"
                  stroke="#16a34a"
                  name="Page Views"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      {loading && <Loader />}
    </div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
  description: PropTypes.string,
};

export default Dashboard;
