function removeAlert(id){
    setTimeout(()=>{
        $(`#${id}`).remove()
    }, 3000);
}

function alert401(id, msg) {
    $(`#${id}`).append(`
        <div class="alert alert-danger text-center" role="alert" id="myAlert">
            ${msg}
        </div>
    `);
    removeAlert('myAlert');
}

function alert200(id, msg) {
    $(`#${id}`).append(`
        <div class="alert alert-success text-center" role="alert" id="myAlert">
            ${msg}
        </div>
    `);
    removeAlert('myAlert');
}