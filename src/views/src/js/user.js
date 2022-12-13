let host = ''; // address service
const ip = (ip) => {
  return host = ip;
}

const logout = () => {
  $('#formLogout').on('submit', (event) => {
    $.ajax({
      url: `${host}/logout`
    });
    event.preventDefault()
  });
}