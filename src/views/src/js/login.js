
$(() => {
  $('#formLogin').on('submit', (event) => {
    $.ajax({
      url: `${location.hostname}`
    });
  });
});