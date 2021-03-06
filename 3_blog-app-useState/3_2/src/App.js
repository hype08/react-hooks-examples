import React from "react";

import "./App.css";
import UserBar from "./user/UserBar";
import CreatePost from "./post/CreatePost";
import PostList from "./post/PostList";

const user = "Henry";
const posts = [
  {
    title: "React Hooks",
    content: "The greatest thing since sliced bread",
    author: "Henry"
  },
  {
    title: "React Fragments",
    content: "The greatest thing since sliced bread",
    author: "Henry"
  }
];

export default function App() {
  return (
    <div style={{ padding: 8 }}>
      <UserBar user={user} />
      <br />
      <CreatePost user={user} />
      <br />
      <hr />
      <PostList posts={posts} />
    </div>
  );
}
