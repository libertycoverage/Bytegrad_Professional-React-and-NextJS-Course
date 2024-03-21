import { useEffect, useState } from "react";

export const useQuantity = () => {
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("https://dummyjson.com/products"); // await before promise
      const data = await response.json(); // .json gives us a promise
      console.log(data);
      setQuantity(data.total);
    };
    fetchProducts();
  }, []);

  // return object
  return {
    quantity: quantity,
    setQuantity: setQuantity,
  };
};
