import { useMemo } from "react";
import useLocationState from "../hook/useLocationState";
import { focusAtom } from "jotai-optics";
import { WritableAtom, useAtom } from "jotai";

const Title = ({
  stateAtom,
}: {
  stateAtom: ReturnType<typeof useLocationState>["stateAtom"];
}) => {
  const titleAtom: WritableAtom<string | undefined, [string], void> = useMemo(
    () => focusAtom(stateAtom, (optic) => optic.prop("title")),
    [stateAtom]
  );
  const [title, setTitle] = useAtom(titleAtom);
  return (
    <input
      type="text"
      placeholder="Title"
      value={title}
      className="title"
      onChange={(e) => setTitle(e.target.value)}
    />
  );
};

export default Title;
