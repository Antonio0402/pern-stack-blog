import { useMemo } from "react";
import { atom } from "jotai";
import { atomsWithMutation, atomsWithQuery, queryClientAtom } from "jotai-tanstack-query";
import { getUser, login, register } from "./api/authApi";
import { createPost, deletePost, getAllPostByCate, getPost } from "./api/blogApi";
import useLocationState from "./hook/useLocationState";
import moment from "moment";
import posts from "./data/posts.json";


export type User = {
  username: string;
  hashed_password: string;
}

export type Profile = {
  username: string;
  user_email?: string;
  pic?: string;
}

export type Post = {
  id: number;
  img: string;
  pic: string;
  username: string;
  date: string;
  title: string;
  content: string;
  cate: string;
}

export const [, loginAtom] = atomsWithMutation((_get) => {
  return ({
    mutationKey: ["login"],
    mutationFn: ({ username, password }: { username: string, password: string }) => login(username, password),
    useErrorBoundary: true,
  })
})

export const [, registerAtom] = atomsWithMutation((_get) => {
  return ({
    mutationKey: ["register"],
    mutationFn: ({ username, password }: { username: string, password: string }) => register(username, password),
    useErrorBoundary: true,
  })
})

export const [userAtom] = atomsWithQuery((_get) => {
  return {
    queryKey: ["user"],
    queryFn: getUser,
    staleTime: Infinity,
    suspense: true,
  }
})

export const postAtom = (id: string) => {
  const [baseAtom] = atomsWithQuery((_get) => ({
    queryKey: ["posts", "id", id],
    queryFn: () => getPost(id),
    keepPreviousData: true,
    enabled: Boolean(id),
    suspense: true,
  }))
  return baseAtom;
}

// export const postByCateAtom = (cate: string) => {
//   const [baseAtom] = atomsWithQuery((_get) => ({
//     queryKey: ["posts", "cate", cate],
//     queryFn: () => getPostByCate(cate),
//     keepPreviousData: true,
//     enabled: Boolean(cate),
//     suspense: true,
//   }))
//   return baseAtom;
// }

export const postsByCateAtom = (cate: string) => {
  const [baseAtom] = atomsWithQuery((_get) => ({
    queryKey: ["posts", cate],
    queryFn: () => getAllPostByCate(cate),
    initialData: () => posts,
    keepPreviousData: true,
    suspense: true,
  }))
  return baseAtom;
}

export const postQuery = (id: string) => ({
  queryKey: ["posts", "id", id],
  queryFn: () => getPost(id),
  keepPreviousData: true,
  enabled: Boolean(id),
  suspense: true,
})

export const postByCateQuery = (cate: string) => ({
  queryKey: ["posts", "cate", cate],
  queryFn: () => getAllPostByCate(cate),
  keepPreviousData: true,
  enabled: Boolean(cate),
  suspense: true,
})

export const useCreatePost = (state: ReturnType<typeof useLocationState>) => {
  const [, baseAtom] = useMemo(() => atomsWithMutation((get) => {
    const queryClient = get(queryClientAtom);
    return {
      mutationKey: ["posts", state?.id || ""],
      mutationFn: async () => {
        const data = get(state.stateAtom);
        if (state?.id) {
          const newData = {
            title: data.title,
            content: data.value,
            cate: data.cate,
            img: data.file
          }
          return createPost(newData, state?.id);
        } else {
          const newData = {
            title: data.title,
            content: data.value,
            cate: data.cate,
            img: data.file,
            date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
          }
          return await createPost(newData);
        }
      },
      onSuccess: () => queryClient.invalidateQueries(["posts"]),
      useErrorBoundary: true
    }
  }), [state?.id, state.stateAtom])

  return baseAtom;
}

export const useDeletePost = (id: number) => {
  const [, baseAtom] = useMemo(() => atomsWithMutation((get) => {
    const queryClient = get(queryClientAtom);
    return {
      mutationKey: ["post", id],
      mutationFn: () => deletePost(id),
      onSuccess: () => queryClient.invalidateQueries(["posts", "id", id])
    }
  }), [id])
  return baseAtom;
}

export const inputAtom = atom<{
  username: string;
  password: string;
}>({
  username: "",
  password: "",
});


// export const useStateAtom = ({ title, desc, cate }: State) => atom({
//   value: atom(title || ""),
//   title: atom(desc || ""),
//   file: atom(null),
//   cat: atom(cate || ""),
// })
