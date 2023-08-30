import {
  Link,
  Params,
  useLoaderData,
  useNavigate,
  useParams,
} from "react-router-dom";
import Menu from "../components/Menu";
import { Suspense } from "react";
import {
  type Post as PostData,
  postQuery,
  postByCateQuery,
  userAtom,
  useDeletePost,
} from "../store";
import moment from "moment";
import DOMPurify from "dompurify";
import { QueryClient } from "@tanstack/query-core";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "../components/ErrorCallback";

// eslint-disable-next-line react-refresh/only-export-components
export const loader =
  (queryClient: QueryClient) =>
  async ({ params }: { params: Params }) => {
    const query = postQuery(params.id || "");
    return (
      queryClient.getQueryData<PostData>(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

const Post = () => {
  const { id } = useParams();
  const [currentUser] = useAtom(userAtom);
  const [, deletePost] = useAtom(useDeletePost(Number(id)));
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // const singPostAtom = useMemo(() => postAtom(id || ""), [id]);
  // const [singlePost] = useAtom(singPostAtom);

  const initialData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof loader>>
  >;
  const { data: singlePost, error } = useQuery({
    ...postQuery(id || ""),
    initialData,
  });

  const handleDelete = async () => {
    try {
      await deletePost([
        undefined,
        {
          onSuccess: () => navigate("/"),
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  queryClient.prefetchQuery(postByCateQuery(singlePost?.cate || ""));
  if (error instanceof Error) {
    return <p>{error?.message}</p>;
  }

  // const getText = (html: string) => {
  //   const doc = new DOMParser().parseFromString(html, "text/html");
  //   return doc.body.textContent;
  // };

  return (
    <div className="single-post">
      <div className="single-post__content">
        <img src={singlePost?.img} alt="post image" />
        <div className="single-post__user">
          {singlePost?.pic && <img src={singlePost.pic} alt="user image" />}
          <div className="single-post__info">
            <span>{singlePost?.username}</span>
            <p>Posted {moment(singlePost?.date).fromNow()}</p>
            {currentUser?.username === singlePost?.username && (
              <div className="single-post-edit">
                <Link to={`/create?edit=${singlePost?.id}`} state={singlePost}>
                  <img src="edit-icon.png" alt="edit-icon" />
                </Link>
                <img
                  src="delete-icon.png"
                  alt="delete-icon"
                  onClick={handleDelete}
                />
              </div>
            )}
          </div>
        </div>
        <h1>{singlePost?.title}</h1>
        <p
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(singlePost?.content || ""),
          }}
        ></p>
      </div>
      <Suspense fallback={<p>Loading...</p>}>
        <Menu cate={singlePost?.cate} />
      </Suspense>
    </div>
  );
};

function PostPage() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={["singlepost"]}>
      <Suspense fallback={<p>Loading...</p>}>
        <Post />
      </Suspense>
    </ErrorBoundary>
  );
}

export default PostPage;
