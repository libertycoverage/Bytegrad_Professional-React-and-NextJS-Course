import { ResetIcon } from "@radix-ui/react-icons";

export default function ResetButton({ setCount }) {
  const handleClick = (event) => {
    setCount(0);
    event.currentTarget.blur();
  };

  return (
    <button
      //onClick={() => {
      //  setCount(0);
      // inline, we are writing logic immediately,
      // sometimes it is a bit cleaner to extract this function before return
      //}}
      // below we need handleClick without parenthesis handleClick() because we want function to wait
      onClick={handleClick}
      className="reset-btn"
    >
      <ResetIcon className="reset-btn-icon" />
    </button>
  );
}
