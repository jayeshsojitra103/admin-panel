import {
  approveUser,
  fetchUsers,
  setFilters,
  toggleBanUser,
} from "@/store/slices/usersSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";

export const useUser = () => {
  const dispatch = useDispatch();
  const { users, loading, filters, currentPage, totalPages } = useSelector(
    (state) => state.users
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [, setDebouncedSearchTerm] = useState(""); // For debounced value
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [date, setDate] = useState({
    from: filters.startDate ? new Date(filters.startDate) : null,
    to: filters.endDate ? new Date(filters.endDate) : null,
  });

  // Fetch users based on the debounced search term and current page
  useEffect(() => {
    console.log("...filters, page: currentPage", filters, currentPage);
    dispatch(fetchUsers({ ...filters }));
  }, [dispatch, filters, currentPage]);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  // Debounce searchTerm
  useEffect(() => {
    setFilters({ search: searchTerm });
    setDebouncedSearchTerm(searchTerm);
    const handler = setTimeout(() => {
      dispatch(setFilters({ search: searchTerm }));
      setDebouncedSearchTerm(searchTerm);
    }, 600);

    return () => {
      clearTimeout(handler); // Clear the timeout on cleanup
    };
  }, [searchTerm, dispatch]);

  const handleAction = (user, action) => {
    setSelectedUser(user);
    setDialogAction(action);
    setShowConfirmDialog(true);
  };

  const confirmAction = async () => {
    if (dialogAction === "approve") {
      await dispatch(approveUser(selectedUser._id));
    } else if (dialogAction === "toggleBan") {
      await dispatch(toggleBanUser(selectedUser._id));
    }
    setShowConfirmDialog(false);
  };

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

  const handlePageChange = (newPage) => {
    dispatch(setFilters({ page: newPage }));
  };

  return {
    filteredUsers,
    handleAction,
    confirmAction,
    loading,
    showConfirmDialog,
    searchTerm,
    setSearchTerm,
    setShowConfirmDialog,
    dialogAction,
    selectedUser,
    handleDateSelect,
    date,
    filters,
    currentPage,
    totalPages,
    handlePageChange,
  };
};
