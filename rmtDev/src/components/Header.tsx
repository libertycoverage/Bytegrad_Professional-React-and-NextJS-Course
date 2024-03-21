import BookmarksButton from "./BookmarksButton";
import Logo from "./Logo";
import SearchForm from "./SearchForm";

// export default function Header({ searchText, setSearchText }) {
export default function Header({ children }: { children: React.ReactNode }) {
  return (
    <header className="header">
      {children}
      {/* this code was moved into App.tsx to utilize children pattern, and avoid prop drilling */}
      {/* <div className="header__top">
        <Logo />
        <BookmarksButton />
      </div>

      <SearchForm searchText={searchText} setSearchText={setSearchText} /> */}
      {/* this code was moved into App.tsx to utilize children pattern, and avoid prop drilling */}
    </header>
  );
}

{
  /* we create a component in Header.tsx to remove this div around these two components */
}
export function HeaderTop({ children }: { children: React.ReactNode }) {
  return <div className="header__top">{children}</div>;
}
