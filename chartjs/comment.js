tMode = false;
let comments = [];
let currentCommentId = null;
let isDragging = false;

$(document).ready(function () {
  $('#commentModeBtn').on('click', function () {
    commentMode = true;
    isDragging = false;
    enableCommentDragging();
    $('.comment-icon').removeClass('hidden');
    $('.grid-stack-item-content').css('pointer-events', 'none').addClass('comment-mode');
    $('.grid-stack').addClass('comment-mode');
    disableGridStackInteractions();
    disableChartInteractions();
  });

  $('#designModeBtn').on('click', function () {
    commentMode = false;
    isDragging = false;
    $('.comment-icon').removeClass('hidden');
    $('.grid-stack-item-content').css('pointer-events', 'auto').removeClass('comment-mode');
    $('.grid-stack').removeClass('comment-mode');
    enableGridStackInteractions();
    enableChartInteractions();
  });

  $('#commentModal').on('shown.bs.modal', function () {
    $('#commentInput').focus();
  });

  $('.grid-stack').on('click', function (e) {
    if (commentMode && !$(e.target).hasClass('comment-icon') && !isDragging && !$(e.target).closest('.grid-stack-item').length) {
      openCommentModal(e, this);
    }
  });

  $('.grid-stack').on('click', '.grid-stack-item-content', function (e) {
    if (commentMode && !$(e.target).hasClass('comment-icon') && !isDragging) {
      openCommentModal(e, this);
    }
  });

  $('#commentModal').on('hidden.bs.modal', function () {
    $('#commentInput').val('');
  });

  function openCommentModal(e, context) {
    $('#commentModalLabel').text('Add Comment');
    $('#commentInput').val('');
    $('#saveCommentBtn').show();
    $('#updateCommentBtn').hide();
    $('#deleteCommentBtn').hide();
    $('#commentModal').modal('show');
    currentCommentId = null;
    const posX = e.pageX - $(context).offset().left;
    const posY = e.pageY - $(context).offset().top;

    $('#saveCommentBtn').off('click').on('click', function () {
      const commentText = $('#commentInput').val();
      if (commentText) {
        const commentId = new Date().getTime();
        comments.push({ id: commentId, text: commentText, x: posX, y: posY });
        renderComment(commentId, posX, posY);
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

  function renderComment(id, x, y) {
    const icon = $('<span>')
      .addClass('comment-icon')
      .attr('data-id', id)
      .css({ top: y, left: x })
      .text('💬')
      .append('<div class="comment-popup"></div>')
      .hover(
        function () {
          const comment = comments.find(c => c.id === id);
          $(this).find('.comment-popup').text(comment.text);
        },
        function () {
          $(this).find('.comment-popup').text('');
        }
      );
    icon.on('click', function () {
      if (isDragging) return;
      if (!commentMode) return;
      const comment = comments.find(c => c.id === id);
      $('#commentModalLabel').text('Edit Comment');
      $('#commentInput').val(comment.text);
      $('#saveCommentBtn').hide();
      $('#updateCommentBtn').show();
      $('#deleteCommentBtn').show();
      $('#commentModal').modal('show');
      currentCommentId = id;
      $('#updateCommentBtn').off('click').on('click', function () {
        const updatedText = $('#commentInput').val();
        if (updatedText) {
          comment.text = updatedText;
          $('#commentModal').modal('hide');
        }
      });

      $('#deleteCommentBtn').off('click').on('click', function () {
        if (confirm('Are you sure you want to delete this comment?')) {
          comments = comments.filter(c => c.id !== currentCommentId);
          $(`.comment-icon[data-id="${currentCommentId}"]`).remove();
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
    if (commentMode) {
      enableCommentDragging();
    }
  }

  function enableCommentDragging() {
    $('.comment-icon').each(function () {
      if (!$(this).data('ui-draggable')) {
        $(this).draggable({
          containment: '.grid-stack',
          start: function () {
            isDragging = true;
          },
          stop: function (event, ui) {
            const commentId = $(this).data('id');
            const comment = comments.find(c => c.id === commentId);
            if (comment) {
              comment.x = ui.position.left;
              comment.y = ui.position.top;
            }
            setTimeout(() => {
              isDragging = false;
            }, 100);
          }
        });
      }
    });
  }

  function disableChartInteractions() {
    $('.grid-stack-item-content > div').each(function () {
      $(this).css('pointer-events', 'none'); // Disable pointer events for Highcharts containers
    });
  }

  function enableChartInteractions() {
    $('.grid-stack-item-content > div').each(function () {
      $(this).css('pointer-events', 'auto'); // Enable pointer events for Highcharts containers
    });
  }

  function disableGridStackInteractions() {
    grid.movable('.grid-stack-item', false);
    grid.resizable('.grid-stack-item', false);
    $('.grid-stack-item').css('pointer-events', 'none');
  }

  function enableGridStackInteractions() {
    grid.movable('.grid-stack-item', true);
    grid.resizable('.grid-stack-item', true);
    $('.grid-stack-item').css('pointer-events', 'auto');
  }
});