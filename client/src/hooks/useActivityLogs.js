import { fetchActivityLogs, setFilters } from "@/store/slices/activitySlice";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useActivityLogs = () => {
  const dispatch = useDispatch();
  const { logs, loading, filters, currentPage, totalPages } = useSelector(
    (state) => state.activity
  );

  const [date, setDate] = useState({
    from: filters.startDate ? new Date(filters.startDate) : null,
    to: filters.endDate ? new Date(filters.endDate) : null,
  });

  useEffect(() => {
    dispatch(fetchActivityLogs(filters));
  }, [dispatch, filters]);

  const handleDateSelect = (newDate) => {
    setDate(newDate);
    if (!newDate) {
      dispatch(
        setFilters({
          startDate: null,
          endDate: null,
          page: 1,
        })
      );
    } else if (newDate?.from && newDate?.to) {
      dispatch(
        setFilters({
          startDate: format(newDate.from, "yyyy-MM-dd"),
          endDate: newDate.to ? format(newDate.to, "yyyy-MM-dd") : null,
          page: 1,
        })
      );
    }
  };

  const handleActionTypeChange = (value) => {
    dispatch(setFilters({ action: value === "all" ? "" : value, page: 1 }));
  };

  const handleRefresh = () => {
    dispatch(fetchActivityLogs(filters));
  };

  const handlePageChange = (newPage) => {
    dispatch(setFilters({ page: newPage }));
  };

  const getActionBadgeColor = (actionType) => {
    const colors = {
      login: "bg-blue-100 text-blue-800",
      logout: "bg-gray-100 text-gray-800",
      registration: "bg-green-100 text-green-800",
      "property-view": "bg-purple-100 text-purple-800",
      "property-search": "bg-yellow-100 text-yellow-800",
      default: "bg-gray-100 text-gray-800",
    };
    return colors[actionType] || colors.default;
  };

  return {
    handleRefresh,
    getActionBadgeColor,
    handleActionTypeChange,
    handleDateSelect,
    handlePageChange,
    logs,
    loading,
    date,
    filters,
    currentPage,
    totalPages,
  };
};
