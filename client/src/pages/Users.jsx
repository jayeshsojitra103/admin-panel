import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Search } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useUser } from "@/hooks/useUser";
import { Popover, PopoverTrigger } from "@radix-ui/react-popover";
import { format } from "date-fns";
import { PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Loader } from "@/components/Loader";
import { Pagination } from "@/components/Pagination";

const Users = () => {
  const {
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
    currentPage,
    totalPages,
    handlePageChange,
  } = useUser();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>
      <Card className="">
        <CardHeader>
          <div className="flex justify-between items-center border-b pb-2">
            <div className="flex gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[300px] justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    selected={date}
                    onSelect={handleDateSelect}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id} className="text-md">
                  <TableCell>
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : user.status === "banned"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {user.status === "pending" ? (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleAction(user, "approve")}
                      >
                        Approve
                      </Button>
                    ) : (
                      <Button
                        variant={
                          user.status === "banned" ? "default" : "destructive"
                        }
                        size="sm"
                        onClick={() => handleAction(user, "toggleBan")}
                      >
                        {user.status === "banned" ? "Unban" : "Ban"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}

              {filteredUsers.length === 0 && (
                <TableRow className="text-center">
                  <TableCell colSpan="5">
                    <h1 className="text-xl font-bold">No User Found</h1>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              {dialogAction === "approve"
                ? "Are you sure you want to approve this user?"
                : `Are you sure you want to ${
                    selectedUser?.status === "banned" ? "unban" : "ban"
                  } this user?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {loading && <Loader />}
    </div>
  );
};

export default Users;
