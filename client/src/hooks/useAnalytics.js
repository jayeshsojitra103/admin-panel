import { fetchAnalytics, setFilters } from "@/store/slices/analyticsSlice";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";

export const useAnalytics = () => {
  const dispatch = useDispatch();
  const {
    data: analytics,
    loading,
    filters,
  } = useSelector((state) => state.analytics);

  const [date, setDate] = useState({
    from: filters.startDate ? new Date(filters.startDate) : null,
    to: filters.endDate ? new Date(filters.endDate) : null,
  });

  useEffect(() => {
    dispatch(fetchAnalytics(filters));
  }, [dispatch, filters]);

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

  const trafficSources = useMemo(
    () =>
      analytics?.flatMap((entry) =>
        entry.topPages.map((page) => ({
          source: page.path, // Path of the page
          visitors: page.views, // Number of views for that page
        }))
      ),
    [analytics]
  );

  const uniqueTrafficSources = useMemo(
    () =>
      trafficSources?.reduce((acc, { source, visitors }) => {
        const existingSource = acc.find((item) => item.source === source);
        if (existingSource) {
          existingSource.visitors += visitors; // Update visitors count
        } else {
          acc.push({ source, visitors }); // Add new source
        }
        return acc;
      }, []),
    [trafficSources]
  );

  const sessionDurationData = useMemo(
    () =>
      analytics?.map((entry) => ({
        date: format(new Date(entry.date), "dd/MM/yyyy"), // Format the date for readability
        sessionDuration: Math.round(entry.avgSessionDuration / 60), // Convert duration to minutes
      })),
    [analytics]
  );
  const handleDateSelect = (newDate) => {
    setDate(newDate);
    if (!newDate) {
      dispatch(
        setFilters({
          startDate: null,
          endDate: null,
        })
      );
    } else if (newDate?.from && newDate?.to) {
      dispatch(
        setFilters({
          startDate: format(newDate.from, "yyyy-MM-dd"),
          endDate: newDate.to ? format(newDate.to, "yyyy-MM-dd") : null,
        })
      );
    }
  };

  return {
    loading,
    analytics,
    sessionDurationData,
    uniqueTrafficSources,
    formattedAnalysis,
    handleDateSelect,
    date,
  };
};
