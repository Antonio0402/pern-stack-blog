import { focusAtom } from "jotai-optics";
import { useMemo } from "react";
import useLocationState from "../hook/useLocationState";
import { useAtom } from "jotai";

const Category = ({
  stateAtom,
}: {
  stateAtom: ReturnType<typeof useLocationState>["stateAtom"];
}) => {
  const cateAtom = useMemo(
    () => focusAtom(stateAtom, (optic) => optic.prop("cate")),
    [stateAtom]
  );

  const [cate, setCate] = useAtom(cateAtom);

  return (
    <>
      <h1>Category</h1>
      <div className="category__item">
        <input
          type="radio"
          checked={cate === "art"}
          name="cate"
          value="art"
          id="art"
          onChange={(e) => setCate(e.target.value)}
        />
        <label htmlFor="art">Art</label>
      </div>
      <div className="category__item">
        <input
          type="radio"
          checked={cate === "science"}
          name="cate"
          value="science"
          id="science"
          onChange={(e) => setCate(e.target.value)}
        />
        <label htmlFor="science">Science</label>
      </div>
      <div className="category__item">
        <input
          type="radio"
          checked={cate === "technology"}
          name="cate"
          value="technology"
          id="technology"
          onChange={(e) => setCate(e.target.value)}
        />
        <label htmlFor="technology">Technology</label>
      </div>
      <div className="category__item">
        <input
          type="radio"
          checked={cate === "cinema"}
          name="cate"
          value="cinema"
          id="cinema"
          onChange={(e) => setCate(e.target.value)}
        />
        <label htmlFor="cinema">Cinema</label>
      </div>
      <div className="category__item">
        <input
          type="radio"
          checked={cate === "design"}
          name="cate"
          value="design"
          id="design"
          onChange={(e) => setCate(e.target.value)}
        />
        <label htmlFor="design">Design</label>
      </div>
      <div className="category__item">
        <input
          type="radio"
          checked={cate === "food"}
          name="cate"
          value="food"
          id="food"
          onChange={(e) => setCate(e.target.value)}
        />
        <label htmlFor="food">Food</label>
      </div>
    </>
  );
};

export default Category;
