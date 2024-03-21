//import styles from "./Title.module.css";

export default function Title({ locked }) {
  // another option is CSS in JS
  // const h1 = h1`
  //    font-size: 2rem;
  //    font-weight: 700;
  // `;

  //return <h1 className="title">Fancy Counter</h1>;
  //return <h1 className={styles.title}>Fancy Counter</h1>;

  return (
    <h1 className="title">
      {
        // we use HTML entities to solve the problem with > sign
        locked ? (
          <span>
            Limit! Buy <b>Pro</b> for &gt;5
          </span>
        ) : (
          "Fancy Counter"
        )
      }
    </h1>
  );
}

// in jsx class is a reserved name for a js class, linking to css we use className
// className="title"> one of the downside of this is that it (.title in CSS file) is in a global scope, we don't want that
// to address this problem we can use css modules
// we rename Title.css as Title.module.css and we add
// import styles from "./Title.module.css";
// we change className="title"> to className={styles.title}>
