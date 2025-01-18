import { loginAdmin } from "@/store/slices/authSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(loginAdmin(credentials));
    if (!result.error) {
      navigate("/");
    }
  };

  return {
    handleSubmit,
    loading,
    error,
    setCredentials,
    credentials,
  };
};
