import { useActiveJobItemId, useJobItem } from "../lib/hooks";
import { JobItemExpanded, jobItem } from "../lib/types";
import BookmarkIcon from "./BookmarkIcon";
import Spinner from "./Spinner";

// BECAUSE MOVED
// type JobItemContentProps = {
//   jobItem: JobItemExpanded | null;
// };

// export default function JobItemContent({ jobItem }: JobItemContentProps) {
export default function JobItemContent() {
  // we want to show EmptyJobContent only when jobItem is null

  //MOVED from App.tsx
  // benefit of that moving is that whenever the id of chosen offer changes, App component rerendered,
  // previously whole App rerendered whenever id changes, it is using useState under the hood,
  // now only this component of JobItemContent will rerender
  const activeJobItemId = useActiveJobItemId();
  console.log(activeJobItemId);
  // const jobItem = useJobItem(activeJobItemId);

  //MOVED from App.tsx
  // we also want to return isLoading state for loading spinner of the details of the offer,
  // when we return -> return { jobItem, isLoading }; in hooks.tsx we destructure object in place here
  // const { jobItem, isLoading } = useJobItem(activeJobItemId);
  // the only downside of that is when you want to rename it e.g. with colon -> const { jobItem: jobItemExpanded, isLoading } = useJobItem(activeJobItemId);
  // renaming in object is annoying

  // const [jobItem, isLoading] = useJobItem(activeJobItemId);
  // error red underline const isLoading: boolean | JobItemExpanded | null, we added "as const" in the returned array in hooks.ts

  // we destructure an object instead of using the array
  const { jobItem, isLoading } = useJobItem(activeJobItemId);

  // we can rename that in place e.g. const [jobItemExpanded, isLoading] = useJobItem(activeJobItemId);
  // this is the same mechanism as in React useState when useState returns an array as in  const [isLoading, setIsLoading] = useState(false);
  // you immediately call isLoading, setIsLoading as you want and useState works

  // we want a loading spinner for offer details
  // when we use useJobItem hook, ideally what we also get back from that hook whether it is in a loading state or not
  // we alter hooks.ts

  if (isLoading) {
    return <LoadingJobContent />;
  }

  if (!jobItem) {
    return <EmptyJobContent />;
  }

  return (
    <section className="job-details">
      <div>
        <img
          // src="https://images.unsplash.com/photo-1610374792793-f016b77ca51a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1272&q=100"
          src={jobItem.coverImgURL}
          // error red underline, TypeScript type cover ImgURL does not exist in type never (empty or nothing type in TypeScript),
          // when we go to jobItem in hooks we initialize useState(null),
          // React will look at the initial value that is passed in useState and will infer the value to be that type
          // it will infer the type to be null, that is one problem
          // another problem is when you fetch data, the default type here is any, here in hooks.ts setJobItem(data.jobItem) is of type any,
          // we need to make sure that jobItem is a correct type, we specify the type with useState<JobItemExpanded | null>(null)
          alt="#"
        />

        <a
          className="apply-btn"
          // href="https://fictional9thtechwebsite.com/"
          href={jobItem.companyURL}
          target="_blank"
        >
          Apply
        </a>

        <section className="job-info">
          <div className="job-info__left">
            {/* <div className="job-info__badge">9T</div> */}
            <div className="job-info__badge">{jobItem.badgeLetters}</div>
            <div className="job-info__below-badge">
              {/* <time className="job-info__time">2d</time> */}
              <time className="job-info__time">{jobItem.daysAgo}d</time>

              <BookmarkIcon />
            </div>
          </div>

          <div className="job-info__right">
            <h2 className="second-heading">{jobItem.title}</h2>
            <p className="job-info__company">{jobItem.company}</p>
            <p className="job-info__description">{jobItem.description}</p>
            <div className="job-info__extras">
              <p className="job-info__extra">
                <i className="fa-solid fa-clock job-info__extra-icon"></i>
                {/* Full-Time */}
                {jobItem.duration}
              </p>
              <p className="job-info__extra">
                <i className="fa-solid fa-money-bill job-info__extra-icon"></i>
                {/* $105,000+ */}
                {jobItem.salary}
              </p>
              <p className="job-info__extra">
                <i className="fa-solid fa-location-dot job-info__extra-icon"></i>{" "}
                {/* Global */}
                {jobItem.location}
              </p>
            </div>
          </div>
        </section>

        <div className="job-details__other">
          <section className="qualifications">
            <div className="qualifications__left">
              <h4 className="fourth-heading">Qualifications</h4>
              {/* <h4 className="fourth-heading">{jobItem.qualifications}</h4> */}
              <p className="qualifications__sub-text">
                Other qualifications may apply
              </p>
            </div>
            <ul className="qualifications__list">
              {/* {jobItem.qualifications.map((qualification) => ( */}
              {/* // if we use qualification as the key we can run into issue, qualification does not have to be unique
                // you can use qualification but run into issues when there are duplicates, and putting here something like {Math.random()} key won't be consistent between renders, <li> will get different key
                // ideally you would like to have something like {qualification.id} here, but here we do not have an id
                // key is particularly important if you are going to switch around the order, or going to remove item from the array, or maybe add element to the array,
                // when you start changing the array it is important that React knows which one is which
                // here we can have weaker key {qualification} 
                // here you can also have index, when you map over array you can have ->  {jobItem.qualifications.map((qualification, index) => (
                // and {index} as a key
                // when you map over the array it will give you the index of element in the array, this is perfectly fine to use in this case
                // this is not a best practice generally speaking, typically you do not wanna use the index, because when you switch around things in the array, you start changing the order,
                // or when you add or remove things from the array, indexes of the elements can change, this will become problem */}
              {/* {jobItem.qualifications.map((qualification, index) => (
                <li key={index} className="qualifications__item"> */}
              {jobItem.qualifications.map((qualification) => (
                <li key={qualification} className="qualifications__item">
                  {qualification}
                </li>
              ))}
              {/* <li className="qualifications__item">React</li> */}
              {/* <li className="qualifications__item">Next.js</li>
              <li className="qualifications__item">Tailwind CSS</li> */}
            </ul>
          </section>

          <section className="reviews">
            <div className="reviews__left">
              <h4 className="fourth-heading">Company reviews</h4>
              <p className="reviews__sub-text">
                Recent things people are saying
              </p>
            </div>
            <ul className="reviews__list">
              {jobItem.reviews.map((review) => (
                <li key={review} className="reviews__item">
                  {review}
                </li>
              ))}

              {/* <li className="reviews__item">Nice building and food also.</li>
              <li className="reviews__item">Great working experience.</li> */}
            </ul>
          </section>
        </div>

        <footer className="job-details__footer">
          <p className="job-details__footer-text">
            If possible, please reference that you found the job on{" "}
            <span className="u-bold">rmtDev</span>, we would really appreciate
            it!
          </p>
        </footer>
      </div>
    </section>
  );
}

function LoadingJobContent() {
  return (
    <section className="job-details">
      <div>
        <Spinner />;
      </div>
    </section>
  );
}

function EmptyJobContent() {
  return (
    <section className="job-details">
      <div>
        <div className="job-details__start-view">
          <p>What are you looking for?</p>
          <p>
            Start by searching for any technology your ideal job is working with
          </p>
        </div>
      </div>
    </section>
  );
}
