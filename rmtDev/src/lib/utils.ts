import toast from "react-hot-toast";

export const handleError = (error: unknown) => {
  let message;
  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "string") {
    message = error;
  } else {
    message = "An error occurred.";
  }

  toast.error(message);
};

// technically you can put these fetch functions in utils.ts file as well,
// cause these are also utility functions, they are also typically called not fetchJobItem but getJobItem
// you can rename them that way
