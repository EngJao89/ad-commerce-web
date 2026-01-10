"use client";

import { toast } from "react-toastify";
import { AxiosError } from "axios";

export const showToast = {
  success: (message: string) => {
    toast.success(message);
  },
  error: (message: string) => {
    toast.error(message);
  },
  warning: (message: string) => {
    toast.warning(message);
  },
  info: (message: string) => {
    toast.info(message);
  },
  default: (message: string) => {
    toast(message);
  },
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      pending: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, messages);
  },
};

export function showApiError(error: unknown) {
  let message = "An error occurred";
  
  if (error instanceof AxiosError) {
    if (error.response) {
      const data = error.response.data as { message?: string } | undefined;
      message = data?.message || error.message || "An error occurred";
    } else if (error.request) {
      const code = error.code;
      if (code === "ECONNRESET" || code === "ETIMEDOUT" || code === "ENOTFOUND") {
        message = "Connection error. The server may be temporarily unavailable. Please try again in a moment.";
      } else if (code === "ECONNREFUSED") {
        message = "Unable to connect to the server. Please check your internet connection.";
      } else {
        message = "Network error. Please check your connection and try again.";
      }
    } else {
      message = error.message || "An error occurred";
    }
  } else if (error instanceof Error) {
    message = error.message || "An error occurred";
  }
  
  showToast.error(message);
}

export function showApiSuccess(message: string) {
  showToast.success(message);
}
