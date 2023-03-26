const videoContainer = document.getElementById("videoContainer");
const videoComment = document.getElementById("video__comment");
const form = document.getElementById("commentForm");
const deleteComment = document.querySelectorAll(".deleteComment");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const span2 = document.createElement("span");
  span2.innerText = "❌";
  span2.classList.add("deleteComment");
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);
};

const handleSubmit = async event => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") return;

  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

const handleDeleteComment = async event => {
  const videoId = videoContainer.dataset.id;
  const commentId = event.target.parentElement.dataset.id;
  const { status } = await fetch(
    `/api/videos/${videoId}/comment/${commentId}`,
    {
      method: "DELETE",
    }
  );
  if (status === 201) event.target.parentElement.remove();
};

if (form) form.addEventListener("submit", handleSubmit);
if (deleteComment)
  deleteComment.forEach(deleteBtn =>
    deleteBtn.addEventListener("click", handleDeleteComment)
  );
