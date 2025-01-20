import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";

type PetButtonProps = {
  actionType: "add" | "edit" | "checkout";
  children?: React.ReactNode;
  onClick?: () => void;
};

export default function PetButton({
  actionType,
  onClick,
  children,
}: PetButtonProps) {
  if (actionType === "add") {
    return (
      <Button size="icon">
        <PlusIcon className="h-6 w-6" />
      </Button>
    );
  }
  if (actionType === "edit") {
    // return <Button variant="secondary">Edit</Button>;
    return <Button variant="secondary">{children}</Button>;
  }

  if (actionType === "checkout") {
    // return <Button variant="secondary">Checkout</Button>;
    return (
      <Button variant="secondary" onClick={onClick}>
        {children}
      </Button>
    );
  }

  //return <Button>Checkout</Button>; //we should be able to omit this fallback
}
