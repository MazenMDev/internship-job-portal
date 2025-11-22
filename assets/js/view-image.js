$("#photo").click(function () {
  $("#view-photo").show();
  $("#blurred-background").show();
});
$("#close-btn , #blurred-background").click(function () {
  $("#view-photo").hide();
  $("#blurred-background").hide();
});
