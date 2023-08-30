import { postByCateQuery } from "../store";
import { useQuery } from "@tanstack/react-query";

const Menu = ({ cate }: { cate: string | undefined }) => {
  const { data: postsByCate } = useQuery(postByCateQuery(cate || ""));
  return (
    <div className="menu">
      <h1 className="text-500 color-gray-300">Other posts you may like</h1>
      {postsByCate?.map((post) => (
        <div className="menu__post" key={post.id}>
          <img src={`../upload/${post?.img}`} alt="" />
          <h2>{post.title}</h2>
          <button className="btn" data-style="edit">
            Read More
          </button>
        </div>
      ))}
    </div>
  );
};

export default Menu;
