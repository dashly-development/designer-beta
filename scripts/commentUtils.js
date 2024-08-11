window.comments = []; // Ensure comments array is initialized

export function initCommentMode() {
  console.log("Initializing Comment Mode");
  window.commentMode = true;
  window.isDragging = false;
  enableCommentDragging();
  $('.comment-icon').removeClass('hidden');
  $('.grid-stack-item-content').css('pointer-events', 'none').addClass('comment-mode');
  $('.grid-stack').addClass('comment-mode');
  disableGridStackInteractions();
  disableChartInteractions();
}

export function initDesignMode() {
  console.log("Initializing Design Mode");
  window.commentMode = false;
  window.isDragging = false;
  $('.comment-icon').removeClass('hidden');
  $('.grid-stack-item-content').css('pointer-events', 'auto').removeClass('comment-mode');
  $('.grid-stack').removeClass('comment-mode');
  enableGridStackInteractions();
  enableChartInteractions();
}

export function saveCommentsToLocalStorage() {
  localStorage.setItem('comments', JSON.stringify(window.comments));
  console.log("Comments saved to local storage");
}

// Load comments from local storage
export function loadCommentsFromLocalStorage() {
  const storedComments = localStorage.getItem('comments');
  if (storedComments) {
    window.comments = JSON.parse(storedComments);
    console.log("Comments loaded from local storage:", window.comments);
  } else {
    window.comments = [];
  }
}

// Call this function on application load
loadCommentsFromLocalStorage();


// Call this function on application load or when entering picture mode
loadCommentsFromLocalStorage();


export function openCommentModal(e, context) {
  console.log("Attempting to open comment modal");
  if (window.commentMode && !$(e.target).hasClass('comment-icon') && !window.isDragging && !$(e.target).closest('.grid-stack-item').length) {
    console.log("Opening comment modal");
    $('#commentModalLabel').text('Add Comment');
    $('#commentInput').val('');
    $('#saveCommentBtn').show();
    $('#updateCommentBtn').hide();
    $('#deleteCommentBtn').hide();
    $('#commentModal').modal('show');
    window.currentCommentId = null;
    const posX = e.pageX - $(context).offset().left;
    const posY = e.pageY - $(context).offset().top;
    console.log(`Comment position: x=${posX}, y=${posY}`);

    $('#saveCommentBtn').off('click').on('click', function () {
      const commentText = $('#commentInput').val();
      console.log("Saving comment:", commentText);
      if (commentText) {
        const commentId = new Date().getTime();
        window.comments.push({ id: commentId, text: commentText, x: posX, y: posY });
        renderComment(commentId, posX, posY);
        saveCommentsToLocalStorage(); // Save to local storage
        $('#commentModal').modal('hide');
      }
    });

    $('#commentInput').off('keypress').on('keypress', function (e) {
      if (e.which === 13) {
        $('#saveCommentBtn').click();
        e.preventDefault();
      }
    });
  }
}

export function renderComment(id, x, y) {
  console.log("Rendering comment with id:", id);
  const icon = $('<span>')
    .addClass('comment-icon')
    .attr('data-id', id)
    .css({ top: y, left: x })
    .text('💬')
    .append('<div class="comment-popup"></div>')
    .hover(
      function () {
        const comment = window.comments.find(c => c.id === id);
        console.log("Displaying comment text:", comment.text);
        $(this).find('.comment-popup').text(comment.text);
      },
      function () {
        console.log("Hiding comment text");
        $(this).find('.comment-popup').text('');
      }
    );
  icon.on('click', function () {
    if (window.isDragging) return;
    if (!window.commentMode) return;
    const comment = window.comments.find(c => c.id === id);
    console.log("Editing comment:", comment);
    $('#commentModalLabel').text('Edit Comment');
    $('#commentInput').val(comment.text);
    $('#saveCommentBtn').hide();
    $('#updateCommentBtn').show();
    $('#deleteCommentBtn').show();
    $('#commentModal').modal('show');
    window.currentCommentId = id;
    $('#updateCommentBtn').off('click').on('click', function () {
      const updatedText = $('#commentInput').val();
      console.log("Updating comment text:", updatedText);
      if (updatedText) {
        comment.text = updatedText;
        $('#commentModal').modal('hide');
      }
    });

    $('#deleteCommentBtn').off('click').on('click', function () {
      console.log("Deleting comment with id:", window.currentCommentId);
      if (confirm('Are you sure you want to delete this comment?')) {
        window.comments = window.comments.filter(c => c.id !== window.currentCommentId);
        $(`.comment-icon[data-id="${window.currentCommentId}"]`).remove();
        $('#commentModal').modal('hide');
      }
    });

    $('#commentInput').off('keypress').on('keypress', function (e) {
      if (e.which === 13) {
        $('#updateCommentBtn').click();
        e.preventDefault();
      }
    });
  });
  $('.grid-stack').append(icon);
  if (window.commentMode) {
    console.log("Enabling comment dragging");
    enableCommentDragging();
  }
}

function enableCommentDragging() {
  console.log("Enabling dragging for comments");
  $('.comment-icon').each(function () {
    if (!$(this).data('ui-draggable')) {
      $(this).draggable({
        containment: '.grid-stack',
        start: function () {
          console.log("Start dragging comment");
          window.isDragging = true;
        },
        stop: function (event, ui) {
          console.log("Stop dragging comment");
          const commentId = $(this).data('id');
          const comment = window.comments.find(c => c.id === commentId);
          if (comment) {
            comment.x = ui.position.left;
            comment.y = ui.position.top;
            console.log(`Comment position updated: id=${commentId}, x=${comment.x}, y=${comment.y}`);
          }
          setTimeout(() => {
            window.isDragging = false;
          }, 100);
        }
      });
    }
  });
}

function disableGridStackInteractions() {
  console.log("Disabling grid interactions");
  window.grid.movable('.grid-stack-item', false);
  window.grid.resizable('.grid-stack-item', false);
  $('.grid-stack-item').css('pointer-events', 'none');
}

function enableGridStackInteractions() {
  console.log("Enabling grid interactions");
  window.grid.movable('.grid-stack-item', true);
  window.grid.resizable('.grid-stack-item', true);
  $('.grid-stack-item').css('pointer-events', 'auto');
}

function disableChartInteractions() {
  console.log("Disabling chart interactions");
  $('.grid-stack-item-content > div').each(function () {
    $(this).css('pointer-events', 'none');
  });
}

function enableChartInteractions() {
  console.log("Enabling chart interactions");
  $('.grid-stack-item-content > div').each(function () {
    $(this).css('pointer-events', 'auto');
  });
}