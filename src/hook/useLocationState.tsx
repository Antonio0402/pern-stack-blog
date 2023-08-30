import { useLocation } from "react-router-dom";
import { Post } from "../store";
import { useMemo } from "react";
import { atom } from "jotai";

const initialState = (state: Partial<Post>) => ({
  value: state?.content || "",
  title: state?.title || "",
  file: "",
  cate: state?.cate || "",
});

const useLocationState = () => {
  const state = useLocation().state;
  const stateAtom = useMemo(
    () =>
      atom<{
        value: string;
        title: string;
        file: string;
        cate: string;
      }>(initialState(state)),
    [state]
  );

  return { stateAtom, id: state?.id };
};

export default useLocationState;
