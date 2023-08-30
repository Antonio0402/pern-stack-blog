import { WritableAtom, useAtom } from "jotai";
import { focusAtom } from "jotai-optics";
import { useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useLocationState from "../hook/useLocationState";

const modules = {
  toolbar: [
    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: 1 }, { header: 2 }], // custom button values
    ["bold", "italic", "underline", "strike", "blockquote"], // toggled buttons
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    [{ align: [] }, { color: [] }, { background: [] }], // dropdown with defaults from theme
    ["clean"], // remove formatting button
  ],
};

const formats = [
  "size",
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "align",
  "color",
  "background",
];

export const Editor = ({
  stateAtom,
}: {
  stateAtom: ReturnType<typeof useLocationState>["stateAtom"];
}) => {
  const valueAtom: WritableAtom<string | undefined, [string], void> = useMemo(
    () => focusAtom(stateAtom, (optic) => optic.prop("value")),
    [stateAtom]
  );
  const [value, setValue] = useAtom(valueAtom);
  return (
    <div className="text-editor">
      <ReactQuill
        className="editor"
        theme="snow"
        modules={modules}
        formats={formats}
        value={value}
        onChange={setValue}
      />
    </div>
  );
};

export default Editor;
