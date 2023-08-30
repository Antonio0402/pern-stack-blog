import { WritableAtom, atom } from "jotai";
import useLocationState from "./useLocationState";
import { focusAtom } from "jotai-optics";
import { useMemo } from "react";
import { upload } from "../api/blogApi";
import { atomsWithMutation } from "jotai-tanstack-query";

const useUploadImg = (
  stateAtom: ReturnType<typeof useLocationState>["stateAtom"]
) => {
  const fileAtom = useMemo<WritableAtom<string | undefined, [string], void>>(
    () => focusAtom(stateAtom, (optic) => optic.prop("file")),
    [stateAtom]
  );

  const fileDataAtom = useMemo(() => atom<File | null>(null), []);

  const [, useUploadFileAtom] = useMemo(
    () =>
      atomsWithMutation((get) => ({
        mutationKey: ["file", get(fileDataAtom)?.name],
        mutationFn: async () => {
          const file = get(fileDataAtom);
          return await upload(file);
        },
        useErrorBoundary: true,
      })),
    [fileDataAtom]
  );

  const setFileDataAtom = useMemo(
    () =>
      atom(null, async (get, set) => {
        if (get(fileDataAtom)) {
          try {
            const atom = get(useUploadFileAtom);
            await atom.mutate(undefined, {
              onSuccess: (data) => set(fileAtom, data || ""),
            });
          } catch (error) {
            console.log(error);
          }
        } else {
          set(fileAtom, "");
        }
      }),
    [fileAtom, fileDataAtom, useUploadFileAtom]
  );

  return { fileDataAtom, setFileDataAtom };
};

export default useUploadImg;
