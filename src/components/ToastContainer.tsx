"use client";

import { ToastContainer as ReactToastifyContainer } from "react-toastify";

export default function ToastContainer() {
  return (
    <ReactToastifyContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      toastClassName="bg-zinc-800 text-white border border-zinc-700"
      progressClassName="bg-zinc-600"
    />
  );
}
