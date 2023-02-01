let produtos = {};
let category = {};
let ip = localStorage.getItem("ip")
ip = ip.split(":");

const token = () => {
    let token = document.cookie;
    token = token.split('=');
    return token;
}

function getProduct() {
    var url = `${ip[0]}:${ip[1]}:3005/product-list`;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.setRequestHeader("Authorization", `${token()[0]} ${token()[1]}`);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            produtos = JSON.parse(xhr.responseText);
            $('#tableProduto').dataTable({
                "ajax": {
                    "url": url,
                    "dataType": 'json',
                    "type": "GET",
                    "beforeSend": function (xhr) {
                        xhr.setRequestHeader("Authorization",
                            "Bearer " + token()[1]);
                    }
                },
                "columns": [
                    { "data": "category[0].name" },
                    { "data": "nome" },
                    { "data": "marca" },
                    { "data": "dt_validade" },
                    { "data": "valor" },
                    { "data": "valor_venda" },
                    { "data": "quantidade" },
                    {
                        "data": "id", "render": function (res) {
                            return `
                            <a class="btn btn-warning" style="margin-left:5px;" onclick="viewProduct('${res}')"><i class="bi bi-eye-fill"></i></a>
                            <a class="btn btn-success" style="margin-left:5px;" onclick="editProduct('${res}')"><i class="bi bi-pencil-fill"></i></a>
                            <a class="btn btn-danger" style="margin-left:5px;" onclick="removeProduct('${res}')"><i class="bi bi-trash3-fill"></i></a>
                        `;
                        }
                    }
                ],
                language: {
                    url: "json/ptBr.json"
                },
                select: false,
                scrollY: '50vh',
                scrollCollapse: true,
                responsive: true
            });
        }
    };
    xhr.send();
    setTimeout(() => {
        $('#tableProduto tbody').on('click', 'tr', function () {
            $(this).toggleClass('selected');
        });
    }, 1000);
    return produtos;
}

getProduct(); // init table

function titleModal(data) {
    if (data == 1) {
        $("#titleModal").text("Novo Registro de Produto");
        $('#formProduto input, textarea').attr('disabled', false);
        $('.categoria, #saveProduct').removeClass('d-none');
        $('.categoria-one').addClass('d-none');
        $('#formProduto select, input, textarea').val('')
    }
    else if (data == 2) $("#titleModal").text("Descrição do Produto");
}

function getCategory() {
    var url = `${ip[0]}:${ip[1]}:3005/category`;
    console.log(url)
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.setRequestHeader("Authorization", `${token()[0]} ${token()[1]}`);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            category = JSON.parse(xhr.responseText);
            listCategory(category.data);
        }
    };
    xhr.send();
}

function listCategory(data) {
    for (var i = 0; i < data.length; i++) {
        $('.categoria').append(`
        <option value="${data[i].id}">${data[i].name}</option>
    `);
    }
}

function maskValues() {
    $('.money').maskMoney({
        prefix: 'R$ ',
        allowNegative: true,
        thousands: '.', decimal: ',',
        affixesStay: true
    });
}
maskValues();

function postcategory() {

    if ($('#inputNewCategory').val().trim() == '') alert401('alertCategory', '* Campo categoria não pode ser vazio!');
    else {
        var url = `${ip[0]}:${ip[1]}:3005/category`;

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url);

        xhr.setRequestHeader("Authorization", `${token()[0]} ${token()[1]}`);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 401) alert401('alertCategory', `Categoria "${$('#inputNewCategory').val()}" já cadastrada.`);
                else if (xhr.status === 200) alert200('alertCategory', `Categoria "${$('#inputNewCategory').val()}" salvo com sucesso.`);
            }
        };

        var data = `{"name":"${$('#inputNewCategory').val()}"}`;

        xhr.send(data);
    }
}

function postProduct() {
    var url = `${ip[0]}:${ip[1]}:3005/product-register`;
    var data = {
        categoria: `${$('.categoria').val()}`,
        nome: `${$('.nome').val()}`,
        marca: `${$('.marca').val()}`,
        modelo: `${$('.modelo').val()}`,
        descricao: `${$('.descricao').val()}`,
        cod_barras: `${$('.cod_barras').val()}`,
        dt_fabricacao: `${$('.dt_fabricacao').val()}`,
        dt_validade: `${$('.dt_validade').val()}`,
        fabricante: `${$('.fabricante').val()}`,
        localizacao: `${$('.localizacao').val()}`,
        quantidade: `${$('.quantidade').val()}`,
        valor: `${$('.valor').val()}`,
        valor_venda: `${$('.valor_venda').val()}`
    };

    $.ajax({
        type: 'POST',
        url: url,
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json',
        async: false,
        headers: {
            "Authorization": `${token()[0]} ${token()[1]}`
        },
        success: (res) => {
            $('#formProduto, select, input, textarea').val(''); // reset form
            $('.exit').click(); //fecha modal
            let table = $('#tableProduto').dataTable();
            let data2 = res.data
            data2.categoria = 'teste'
            table.dataTable().fnAddData(data2); // add bew row
            setTimeout(() => {
                $('#formProduto, select, input').val(''); // reset form
                alert200('msgAction', res.message); //apresenta mensagem
            }, 500);
        }, error: (res) => {
            const msg = res.responseJSON;
            alert401('alertPostProduct', `${msg.data}!`)
        }
    });
}

function colorDark(id) {
    let table = $('#tableProduto');
    table.addClass('table-dark');
    $(`#${id}`).addClass('d-none');
    $('#colorlight').removeClass('d-none');
}
function colorLight(id) {
    let table = $('#tableProduto');
    table.removeClass('table-dark');
    $(`#${id}`).addClass('d-none');
    $('#colorDark').removeClass('d-none');
}

function viewProduct(id) {
    const url = `${ip[0]}:${ip[1]}:3005/get-product/${id}`;
    $.ajax({
        type: 'GET',
        url: url,
        contentType: 'application/json',
        async: false,
        headers: {
            "Authorization": `${token()[0]} ${token()[1]}`
        },
        success: (res) => {
            $('.nome').val(res.data[0].nome);
            $('.marca').val(res.data[0].marca);
            $('.modelo').val(res.data[0].modelo);
            $('.descricao').val(res.data[0].descricao);
            $('.cod_barras').val(res.data[0].cod_barras);
            $('.dt_fabricacao').val(res.data[0].dt_fabricacao);
            $('.dt_validade').val(res.data[0].dt_validade);
            $('.fabricante').val(res.data[0].fabricante);
            $('.localizacao').val(res.data[0].localizacao);
            $('.quantidade').val(res.data[0].quantidade);
            $('.valor').val(res.data[0].valor);
            $('.valor_venda').val(res.data[0].valor_venda);

            setTimeout(() => {
                $('#modalProduto').modal('show');
                $('#formProduto input, textarea').attr('disabled', true);
                $('.categoria, #saveProduct').addClass('d-none');
                $('#input-categoria').append(`
                    <input type="text" value="${res.data[0].category[0].name}" class="categoria-one form-control mb-3" disabled>
                `);
                $('#editProduct').addClass('d-none');
                $('#titleModal').text('Visualização Produto');
            }, 1000)
        }, error: (res) => {
            alert(res);
        }
    });
}

function editProduct(id) {
    const url = `${ip[0]}:${ip[1]}:3005/get-product/${id}`;
    $.ajax({
        type: 'GET',
        url: url,
        contentType: 'application/json',
        async: false,
        headers: {
            "Authorization": `${token()[0]} ${token()[1]}`
        },
        success: (res) => {
            getCategory();
            //$('.categoria').val().change();
            
            $('.nome').val(res.data[0].nome);
            $('.marca').val(res.data[0].marca);
            $('.modelo').val(res.data[0].modelo);
            $('.descricao').val(res.data[0].descricao);
            $('.cod_barras').val(res.data[0].cod_barras);
            $('.dt_fabricacao').val(res.data[0].dt_fabricacao);
            $('.dt_validade').val(res.data[0].dt_validade);
            $('.fabricante').val(res.data[0].fabricante);
            $('.localizacao').val(res.data[0].localizacao);
            $('.quantidade').val(res.data[0].quantidade);
            $('.valor').val(res.data[0].valor);
            $('.valor_venda').val(res.data[0].valor_venda);

            setTimeout(() => {
                
                $('#modalProduto').modal('show');
                $('.categoria').removeClass('d-none');
                $('#formProduto input, textarea').attr('disabled', false);
                $(`.categoria option[value=${res.data[0].category[0]._id}]`).attr('selected','selected');
                $('.categoria-one').addClass('d-none');
                $('#saveProduct').addClass('d-none');
                $('#titleModal').text('Editar Produto');
                $('#editProduct').removeClass('d-none');
                $('#idProduct').val(`${res.data[0]._id}`)
                idProduct = res.data[0]._id
            }, 1000)
        }, error: (res) => {
            alert(res);
        }
    });
}

let idProduct = '';

function PutProduct(){
    var url = `${ip[0]}:${ip[1]}:3005/product-edit/${idProduct}`;

    var data = {
        categoria: `${$('.categoria').val()}`,
        nome: `${$('.nome').val()}`,
        marca: `${$('.marca').val()}`,
        modelo: `${$('.modelo').val()}`,
        descricao: `${$('.descricao').val()}`,
        cod_barras: `${$('.cod_barras').val()}`,
        dt_fabricacao: `${$('.dt_fabricacao').val()}`,
        dt_validade: `${$('.dt_validade').val()}`,
        fabricante: `${$('.fabricante').val()}`,
        localizacao: `${$('.localizacao').val()}`,
        quantidade: `${$('.quantidade').val()}`,
        valor: `${$('.valor').val()}`,
        valor_venda: `${$('.valor_venda').val()}`
    };
    
    $.ajax({
        type: 'PUT',
        url: url,
        data: JSON.stringify(data),
        contentType: 'application/json',
        async: false,
        headers: {
            "Authorization": `${token()[0]} ${token()[1]}`
        },
        success: (res) => {
            $('#formProduto, select, input, textarea').val(''); // reset form
            $('.exit').click(); //fecha modal
            alert200('msgAction', res.message); //apresenta mensagem
        }, error: (res) => {
            const msg = res.message;
            alert401('alertPostProduct', `${msg}!`)
        }
    });
}

function removeProduct(id) {
    alert('delete' + id);
}

function addCategoria() {
    $('#inputNewCategory').attr('disabled', false);
}