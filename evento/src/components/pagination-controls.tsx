//V246
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const btnStyles =
  "text-white flex items-center gap-x-2 px-5 py-3 bg-white/5 rounded-md opacity-75 hover:opacity-100 transition text-sm";

type PaginationControlsProps = {
  previousPath: string;
  nextPath: string;
};

export default function PaginationControls({
  previousPath,
  nextPath,
}: PaginationControlsProps) {
  return (
    <section className="flex justify-between w-full">
      {previousPath ? (
        <Link
          // href="/events/austin?page=1"
          href={previousPath}
          // className="text-white flex items-center gap-x-2 px-5 py-3 bg-white/5 rounded-md opacity-75 hover:opacity-100 transition text-sm"
          className={btnStyles}
        >
          <ArrowLeftIcon />
          Previous
        </Link>
      ) : (
        // ) : null}
        <div />
      )}

      {nextPath && (
        <Link
          //   href="/events/austin?page=3"
          href={nextPath}
          className={btnStyles}
        >
          Next
          <ArrowRightIcon />
        </Link>
      )}
    </section>
  );
}
//V246
