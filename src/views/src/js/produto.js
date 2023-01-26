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
            listTable(produtos.data)
        }
    };
    xhr.send();
    return produtos;
}
getProduct()

function filterTable() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("filterTable");
    filter = input.value.toUpperCase();
    table = document.getElementById("tableProduto");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        console.log(tr[0])
        td = tr[i].getElementsByTagName("td")[1];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function listTable(data) {

    for (var i = 0; i < data.length; i++) {
        $('.appendProduct').append(`
            <tr class="position${i} columnTable">
                <td>${data[i].category[0].name}</td>
                <td>${data[i].descricao.substring(0, 20) + '...'}</td>
                <td>${data[i].dt_fabricacao}</td>
                <td>${data[i].dt_validade}</td>
                <td>${data[i].fabricante}</td>
                <td>${data[i].localizacao}</td>
                <td>${data[i].marca}</td>
                <td>${data[i].nome}</td>
                <td>${data[i].quantidade}</td>
                <td id="${data[i].id}">
                    <button type="buttom" onclick="titleModal(2)" class="btn btn-primary" data-bs-toggle="modal"
                        data-bs-target="#modalProduto">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button type="buttom" class="btn btn-warning">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button type="buttom" class="btn btn-danger">
                        <i class="bi bi-trash3"></i>
                    </button>
                </td>
            </tr>
        `);
    }
}

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

function postProduct(){
    var url = `${ip[0]}:${ip[1]}:3005/product-register`;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.setRequestHeader("Authorization", `${token()[0]} ${token()[1]}`);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 400) alert401('alertPostProduct', `Erro ao salvar produto! \nError: ${xhr.responseText}`);
            else if (xhr.status === 201) alert200('alertPostProduct', `Produto salvo com sucesso!`);
        }
    };

    var data = `
        {
            "categoria": "${$('.categoria').val()}",
            "nome": "${$('.nome').val()}",
            "marca": "${$('.marca').val()}",
            "modelo": "${$('.modelo').val()}",
            "descricao": "${$('.descricao').val()}",
            "cod_barras": "${$('.cod_barras').val()}",
            "dt_fabricacao": "${$('.dt_fabricacao').val()}",
            "dt_validade": "${$('.dt_validade').val()}",
            "fabricante": "${$('.fabricante').val()}",
            "localizacao": "${$('.localizacao').val()}",
            "quantidade": ${$('.quantidade').val()},
            "valor": "${$('.valor').val()}",
            "valor_venda": "${$('.valor_venda').val()}"
        }
    `;

    xhr.send(data);
}