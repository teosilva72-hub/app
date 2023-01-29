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
function viewProduct(data) {
    console.log(data)
}
getProduct(); // init table

function titleModal(data) {
    if (data == 1) $("#titleModal").text("Novo Registro de Produto");
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
            $('#formProduto, select, input').val(''); // reset form
            $('.exit').click(); //fecha modal
            console.log(res.data)
            let table = $('#tableProduto').dataTable();
            //$('#tableProduto').dataTable().fnClearTable();
            const data2 = res.data
            
            table.dataTable().fnAddData(data2); // add bew row
            $('#formProduto, select, input').val(''); // reset form
            console.log(data2)
            alert200('msgAction', res.message); //apresenta mensagem
        }, error: (res) => {
            const msg = res.responseJSON;
            alert401('alertPostProduct', `${msg.data}!`)
        }
    });
}

function colorDark(id){
    console.log(id)
    let table = $('#tableProduto');
    table.addClass('table-dark');
    $(`#${id}`).addClass('d-none');
    $('#colorlight').removeClass('d-none');
}
function colorLight(id){
    let table = $('#tableProduto');
    table.removeClass('table-dark');
    $(`#${id}`).addClass('d-none');
    $('#colorDark').removeClass('d-none');
}