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

    // When saving a comment, we just push it to the comments array and render it
    $('#saveCommentBtn').off('click').on('click', function () {
      const commentText = $('#commentInput').val();
      console.log("Saving comment:", commentText);
      if (commentText) {
        const commentId = new Date().getTime();
        // Push the comment to the window.comments array
        window.comments.push({ id: commentId, text: commentText, x: posX, y: posY });
        // Render the comment visually
        renderComment(commentId, posX, posY);
        // No need to save to localStorage, comments will be saved as part of the layout in IndexedDB
        $('#commentModal').modal('hide');
      }
    });

    // Handle the Enter key press to save the comment
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

  // Find the comment from the stored comments
  const comment = window.comments.find(c => c.id === id);
  if (!comment) {
    console.error("No comment found for id:", id);
    return;
  }

  // Remove any existing comment icon with the same ID to avoid duplicates
  $(`.comment-icon[data-id="${id}"]`).remove();

  // Create the comment icon element
  const icon = $('<span>')
    .addClass('comment-icon')
    .attr('data-id', id)
    .css({ top: y, left: x })
    .text('💬')
    .append('<div class="comment-popup"></div>')
    .hover(
      function () {
        const commentText = window.comments.find(c => c.id === id)?.text;
        console.log("Displaying comment text:", commentText);
        $(this).find('.comment-popup').text(commentText);
      },
      function () {
        console.log("Hiding comment text");
        $(this).find('.comment-popup').text('');
      }
    );

  // Attach click event for editing the comment
  icon.on('click', function () {
    if (window.isDragging) return;
    if (!window.commentMode) return;

    const comment = window.comments.find(c => c.id === id);
    if (comment) {
      console.log("Editing comment:", comment);
      $('#commentModalLabel').text('Edit Comment');
      $('#commentInput').val(comment.text);
      $('#saveCommentBtn').hide();
      $('#updateCommentBtn').show();
      $('#deleteCommentBtn').show();
      $('#commentModal').modal('show');
      window.currentCommentId = id;

      // Update the comment when the update button is clicked
      $('#updateCommentBtn').off('click').on('click', function () {
        const updatedText = $('#commentInput').val();
        console.log("Updating comment text:", updatedText);
        if (updatedText) {
          comment.text = updatedText;
          $('#commentModal').modal('hide');
          renderComment(id, comment.x, comment.y);  // Re-render the updated comment
          console.log("Comment updated in memory.");
        }
      });

      // Delete the comment when the delete button is clicked
      $('#deleteCommentBtn').off('click').on('click', function () {
        console.log("Deleting comment with id:", window.currentCommentId);
        if (confirm('Are you sure you want to delete this comment?')) {
          // Remove the comment from window.comments
          window.comments = window.comments.filter(c => c.id !== window.currentCommentId);
          // Remove the comment icon from the grid
          $(`.comment-icon[data-id="${window.currentCommentId}"]`).remove();
          $('#commentModal').modal('hide');
          console.log("Comment deleted from memory.");
        }
      });
    }
  });

  // Append the comment icon to the grid
  $('.grid-stack').append(icon);

  // Ensure comments can be dragged when in comment mode
  if (window.commentMode) {
    enableCommentDragging();  // Calls the drag functionality if needed
  }

  console.log("Comment rendered with id:", id, "at position:", { x, y });
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