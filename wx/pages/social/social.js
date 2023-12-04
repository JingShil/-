// comments.js
Page({
  data: {
    comments: [
      "Comment 1",
      "Comment 2",
      "Comment 3",
      "Comment 4",
      "Comment 5",
      "Comment 6",
      "Comment 7",
      "Comment 8",
      "Comment 9",
      "Comment 10"
    ],
    newComment: ''
  },
  inputComment(e) {
    this.setData({
      newComment: e.detail.value
    });
  }
});