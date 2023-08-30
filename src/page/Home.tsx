import { Link, useLocation } from "react-router-dom";
import { Suspense, useMemo } from "react";
import { postsByCateAtom } from "../store";
import { useAtom } from "jotai";
import { ErrorFallback } from "../components/ErrorCallback";
import { ErrorBoundary } from "react-error-boundary";

const Home = () => {
  const cate = useLocation().search;
  const postsByCateAtomData = useMemo(() => postsByCateAtom(cate), [cate]);
  const [postsByCate] = useAtom(postsByCateAtomData);

  const getText = (html: string) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent;
  };

  return (
    <div className="home">
      <div className="home__posts | flow">
        {postsByCate?.map((post) => (
          <div className="post" key={post.id}>
            <div className="post__img">
              <img src={post.img} alt="blog image" />
            </div>
            <div className="post__content">
              <Link className="link" to={`/post/${post.id}`}>
                <h1 className="text-900">{post.title}</h1>
              </Link>
              <p className="text-500">{getText(post.content)}</p>
              <button className="btn" data-style="read">
                Read More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function HomePage() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={["home"]}>
      <Suspense fallback={<p>Loading...</p>}>
        <Home />
      </Suspense>
    </ErrorBoundary>
  );
}

export default HomePage;
