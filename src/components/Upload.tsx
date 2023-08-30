import { useAtom, useSetAtom } from "jotai";
import { useCreatePost } from "../store";
import { useNavigate } from "react-router-dom";
import useUploadImg from "../hook/useUploadImg";
import useLocationState from "../hook/useLocationState";

const Upload = ({ state }: { state: ReturnType<typeof useLocationState> }) => {
  const { fileDataAtom, setFileDataAtom } = useUploadImg(state.stateAtom);
  const setFileData = useSetAtom(setFileDataAtom);
  const [post, createPost] = useAtom(useCreatePost(state));
  const navigate = useNavigate();
  const [, setFile] = useAtom(fileDataAtom);

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    await setFileData();
    try {
      await createPost([
        undefined,
        {
          onSuccess: () => navigate("/"),
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="new-post__item">
      <h1>Publish</h1>
      <span>
        <b>Status: </b> Draft
      </span>
      <span>
        <b>Visibility: </b> Public
      </span>
      {/* <form
        action="http://localhost:5001/api/v1/upload"
        method="POST"
        encType="multipart/form-data"
        id="upload"
      > */}
      <input
        style={{ display: "none" }}
        type="file"
        id="upfile"
        name="upfile"
        onChange={(e) => {
          if (e.target.files) {
            setFile(e.target.files[0]);
          }
        }}
      />
      <label className="upload__label" htmlFor="upfile">
        Upload Image
      </label>
      {/* </form> */}
      <div className="button-group">
        <button className="btn" type="button" data-style="save">
          Save as a draft
        </button>
        <button
          className="btn"
          type="submit"
          data-style="save"
          // form="upload"
          onClick={handleClick}
          disabled={post.isLoading}
        >
          Publish
        </button>
      </div>
    </div>
  );
};

export default Upload;
