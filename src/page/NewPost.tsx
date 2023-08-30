import { Suspense, useMemo } from "react";
import useLocationState from "../hook/useLocationState";

import Title from "../components/Title";
import Editor from "../components/Editor";
import Upload from "../components/Upload";
import Category from "../components/Category";
import { ErrorFallback } from "../components/ErrorCallback";
import { ErrorBoundary } from "react-error-boundary";

const NewPost = () => {
  const state = useLocationState();
  const memoizedState = useMemo(() => state.stateAtom, [state.stateAtom]);

  return (
    <div className="new-post">
      <div className="new-post__content">
        <Title stateAtom={memoizedState} />
        <Editor stateAtom={memoizedState} />
      </div>
      <div className="new-post__menu">
        <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={["upload"]}>
          <Suspense fallback={<p>Loading...</p>}>
            <Upload state={state} />
          </Suspense>
        </ErrorBoundary>
        <div className="new-post__item">
          <Category stateAtom={memoizedState} />
        </div>
      </div>
    </div>
  );
};

export default NewPost;
