let host = ''; // address service
let data = {}; //user 
const init = (ip, user) => {
  host = ip;
  localStorage.setItem("ip", ip)
  data = JSON.parse(user);
}

const logout = async () => {
  try {

    $.ajax({
      url: `${host}/logout`
    });

  } catch (error) {
    console.log(error)
  }
}