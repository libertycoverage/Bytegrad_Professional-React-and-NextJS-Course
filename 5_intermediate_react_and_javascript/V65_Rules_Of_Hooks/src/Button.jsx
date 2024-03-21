export default function Button({ setQuantity }) {
  return (
    <button
      onClick={() => {
        setQuantity((prev) => prev + 1);
      }}
    >
      +
    </button>
  );
}
