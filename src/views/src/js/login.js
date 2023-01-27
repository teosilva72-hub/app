let ip = $('#host').val();
ip = ip.split(":");
const token = () => {
  let token = document.cookie;
  token = token.split('=');
  return token;
}

$(() => {
  $('#formLogin').on('submit', (event) => {
    $.ajax({
      url: `${location.hostname}`
    });
  });
});

function free() {
  var pass = prompt("Digite a senha de acesso.");
  if (pass == 'admin') $('#btnRegister').click();
  else alert('Senha invalida.');
}

function postUser() {
  
  var url = `${ip[0]}:${ip[1]}:3005/user-register`;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url);

  //xhr.setRequestHeader("Authorization", `${token()[0]} ${token()[1]}`);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 401) alert401('msgUser', `Erro ao salvar produto! \nError: ${xhr.responseText}`);
      else if (xhr.status === 201) alert200('msgUser', `Usuário salvo com sucesso!`);
    }
  };

  var data = `
      {
        "name": "${$('.name').val()}",
        "nickName": "${$('.nickName').val()}",
        "email": "${$('.email').val()}",
        "password": "${$('.password').val()}",
        "cell": "${$('.cell').val()}",
        "sex": "${$('.sex').val()}",
        "birth": "${$('.birth').val()}",
        "sex":"${$('.sex').val()}"
      }
  `;

  xhr.send(data);
}