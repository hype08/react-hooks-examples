import React, { useState, useContext, useEffect } from "react";
import { useResource } from "react-request-hook";
import { useNavigation } from "react-navi";
import { StateContext } from "../contexts";
import useUndo from "use-undo";
import { useInput } from "react-hookedup";
import { useDebouncedCallback } from "use-debounce";

export default function CreatePost() {
  const { state, dispatch } = useContext(StateContext);
  const { user } = state;

  const { value: title, bindToInput: bindTitle } = useInput;

  const [content, setInput] = useState("");
  const [
    undoContent,
    { set: setContent, undo, redo, canUndo, canRedo }
  ] = useUndo("");

  // allow undos in time intervals
  const [setDebounce, cancelDebounce] = useDebouncedCallback(value => {
    setContent(value);
  }, 200);
  useEffect(() => {
    cancelDebounce();
    setInput(undoContent.present);
  }, [undoContent]);

  // pass post data to the createPost function.
  // we dont need to store the post in state, so ignore first value of array by not specifying it and putting a comma.
  const [post, createPost] = useResource(({ title, author, content }) => ({
    url: "/posts",
    method: "post",
    data: { title, author, content }
  }));

  const navigation = useNavigation();

  useEffect(() => {
    if (post && post.data) {
      dispatch({ type: "CREATE_POST", ...post.data });
      navigation.navigate(`/view/${post.data.id}`);
    }
  }, [post]);

  function handleContent(e) {
    const { value } = e.target;
    setInput(value);
    setDebounce(value);
  }

  function handleCreate() {
    createPost({ title, author: user, content });
  }

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        handleCreate();
      }}
    >
      <div>
        Author: <b>{user}</b>
      </div>
      <div>
        <label htmlFor="create-title">Title: </label>
        <input
          type="text"
          value={title}
          {...bindTitle}
          name="create-title"
          id="create-title"
        />
      </div>
      <textarea value={content} onChange={handleContent} />
      <button type="button" onClick={undo} disabled={!canUndo}>
        Undo
      </button>
      <button type="button" onClick={redo} disabled={!canRedo}>
        Redo
      </button>
      <input type="submit" value="Create" />
    </form>
  );
}
