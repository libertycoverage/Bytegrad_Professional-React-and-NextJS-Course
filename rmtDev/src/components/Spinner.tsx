export default function Spinner() {
  return <div className="spinner"></div>;
}

// when we are searching (fetching data in the background) we want a loading spinner animation until the search completes
// we need to add Spinner to the JobList, we need to keep track if we are in loading state or not,
// we cannot derive that from the existing state in App.tsx
// we create isLoading and it's setter function, then the state of the spinner is described in App.tsx fetch
