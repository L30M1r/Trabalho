


const modal = document.querySelector(".modal-container");
const carregando = document.querySelector(".carregando");
const inputPesquisar = document.querySelector('.input-pesquisar');
const pesquisar = document.querySelector(".pesquisar");
const adicionarTarefa = document.querySelector(".adicionar"); 
const containerTarefas = document.querySelector(".lista-tarefas");
let userIdMax = 10;
let tarefaIdMax = 200;


(function(){
    mostrarTodasTarefas();
    adicionarTarefa.addEventListener("click", ()=>{
        adicionarNovaTarefa();
    })

    pesquisarTarefasUser();

    inputPesquisar.addEventListener("blur", (e) => {

        if (inputPesquisar.value === "") {
            mostrarTodasTarefas()
        }
    })

})();


async function mostrarTodasTarefas() {

    carregando.style.display = "block";

    if (containerTarefas) {
        containerTarefas.style.display = "none";
    }

    const request = await fetch('https://jsonplaceholder.typicode.com/todos')
    if (!request.ok) {
        console.log("Erro na requisição");
    } else {

        const resposta = await request.json();

        carregando.style.display = "none";
        containerTarefas.style.display = "block";

        containerTarefas.innerHTML = "";

        for (let item of resposta) {



            containerTarefas.insertAdjacentHTML('afterbegin',

                `<div class="tarefa">
                    <div class="tarefa-textos">
                    <div class="id-e-titulo">
                        <p class="id-usuario">Usuário: ${item.userId} - </p>
                        <h2 class="titulo-tarefa"> ${item.title} </h2>
                    </div>
                        <p class="descricao">Sem descrição</p>
                    </div>
                   
                    <div class="tarefa-botaos"> 
                        <button class="completar"><img src="./imgs/icons8-done-30.png"
                                alt=""></button>
                        <button class="editar"><img src="./imgs/icons8-edit-30.png" alt=""></button>
                        <button class="deletar"><img src="./imgs/icons8-delete-24.png" alt=""></button>
                    </div>

                </div>`)


        }




        document.querySelectorAll(".tarefa").forEach((item, index) => {

            if (resposta[index].completed) {

                item.querySelector('.titulo-tarefa').style.textDecoration = "line-through";
                item.querySelector(".id-usuario").style.textDecoration = "line-through";
                item.querySelector(".descricao").style.textDecoration = "line-through";
            } else {
                item.querySelector('.titulo-tarefa').style.textDecoration = "none";
                item.querySelector('.id-usuario').style.textDecoration = "none";
                item.querySelector(".descricao").style.textDecoration = "none";
            }
        })

        document.querySelectorAll(".editar").forEach((item, index) => {

            item.onclick = () => {
                const divPai = item.parentElement.parentElement;
                const dados = {
                    id: resposta[resposta.length-index -1].id,
                    userId: resposta[resposta.length-index -1].userId,
                    completed: resposta[resposta.length-index -1].completed,
                    title: divPai.querySelector("h2").innerText,
                    descricao: divPai.querySelector(".descricao").innerText 
                }
                console.log(dados);
                mostrarModalEditar(dados, divPai);
            }
        })

        document.querySelectorAll(".deletar").forEach((item, index) => {
            item.addEventListener("click", (eveneto) => {
                deletarTarefa(resposta[index].id);
                const divPai = item.parentElement.parentElement;
                divPai.remove();
            })
        })

        document.querySelectorAll(".completar").forEach((item, index) => {

            item.onclick = () => {
                let completa = !resposta[index].completed;
                completarTarefa(resposta[index].id, completa);
                resposta[index].completed = completa;

                const divPai = item.parentElement.parentElement;
            if (completa) {
                divPai.querySelector('.titulo-tarefa').style.textDecoration = "line-through";
                divPai.querySelector(".id-usuario").style.textDecoration = "line-through";
                divPai.querySelector(".descricao").style.textDecoration = "line-through";
            } else {
                divPai.querySelector('.titulo-tarefa').style.textDecoration = "none";
                divPai.querySelector('.id-usuario').style.textDecoration = "none";
                divPai.querySelector(".descricao").style.textDecoration = "none";
            }
            }
        })



    }


}

async function adicionarNovaTarefa() {




    carregando.style.display = "block"
    containerTarefas.style.display = "none"

    const title = document.querySelector(".titulo-input").value
    const descricao = document.querySelector(".descricao-input").value 

    if (!title || !descricao) {
        alert("coloque os dados da tarefa")
        carregando.style.display = "none"
        containerTarefas.style.display = "block"
    } else {

        tarefaIdMax +=1;
        userIdMax+= 1;
        const request = await fetch("https://jsonplaceholder.typicode.com/todos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: userIdMax,
                userId: userIdMax,
                title: title,
                completed: false
            })
        });
        const resposta = await request.json();
        console.log(resposta);
     
        if (!request.ok) {
            console.log("Erro ao criar nova tarefa");
        } else {

            containerTarefas.insertAdjacentHTML('afterbegin',
                `<div class="tarefa nova-tarefa">
                    <div class="tarefa-textos">
                    <div class="id-e-titulo">
                        <p class="id-usuario">Usuário: ${resposta.userId} - </p>
                        <h2 class="titulo-tarefa"> ${title} </h2>
                    </div>
                        <p class="descricao">${descricao}</p>
                    </div>
                   
                    <div class="tarefa-botaos"> 
                        <button class="completar"><img src="./imgs/icons8-done-30.png"
                                alt=""></button>
                        <button class="editar"><img src="./imgs/icons8-edit-30.png" alt=""></button>
                        <button class="deletar"><img src="./imgs/icons8-delete-24.png" alt=""></button>
                    </div>

                </div>`);


            const novaTarefa = document.querySelector('.nova-tarefa');

            novaTarefa.querySelector('.editar').onclick = () => {
                const dados = {
                    id: tarefaIdMax, // isso aq
                    userId: resposta.userId,
                    completed: resposta.completed,
                    title: title,
                    descricao: descricao
                }
                mostrarModalEditar(dados, document.querySelector(".tarefa"))
            }

            novaTarefa.querySelectorAll(".deletar").forEach((item) => {

                item.onclick = () => {
                    deletarTarefa(resposta.id);
                    novaTarefa.remove();
                }
            })

            novaTarefa.querySelector('.completar').onclick = () => {
                let completa = !resposta.completed;
                completarTarefa(resposta.id, completa);
                resposta.completed = completa;

                const divPai = novaTarefa.parentElement;
                if (completa) {
                    divPai.querySelector('.titulo-tarefa').style.textDecoration = "line-through";
                    divPai.querySelector(".id-usuario").style.textDecoration = "line-through";
                    divPai.querySelector(".descricao").style.textDecoration = "line-through";
                } else {
                    divPai.querySelector('.titulo-tarefa').style.textDecoration = "none";
                    divPai.querySelector('.id-usuario').style.textDecoration = "none";
                    divPai.querySelector(".descricao").style.textDecoration = "none";
                }

            }

            carregando.style.display = "none"
            containerTarefas.style.display = "block"

        }



    }
}


async function deletarTarefa(id) {
    if (id > 200) {
        console.log("user n api");
    } else {
        const request = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
            method: "DELETE",
        });
        if (!request.ok) {
            console.log("Erro ao deletar"); // n mostrou
        }
        const data = await request.json();
        console.log(data); // {};
    }
}

async function completarTarefa(id, isCompleted) {

    if (id > 200) {
        console.log("id não existe na api");
    } else {

        const request = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                completed: isCompleted
            })
        });

        if (!request.ok) {
            console.log("erro da net");
        }

    }
}

function mostrarModalEditar(todo, pai) {


    modal.showModal();
    modal.querySelector(".cancelar-edicao").onclick = () => modal.close();
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.close();
        }
    };
    console.log(todo)


    if (todo.descricao == null) {
        todo.descricao = "Sem descrição"
        console.log("teste")
    }

    const mudarTitulo = document.querySelector(".titulo-editar")
    const mudarDescricao = document.querySelector(".descricao-editar")

    mudarTitulo.value = todo.title;
    mudarDescricao.value = todo.descricao;
    console.log(todo.title, todo.descricao);

    document.querySelector(".id-editar").innerHTML = `ID: ${todo.id}`;
    document.querySelector(".user-editar").innerHTML = `Usuário: ${todo.userId}`;

    document.querySelector(".atualizar").onclick = () => {
        const novoDado = {
            id: todo.id,
            userId: todo.userId,
            title: mudarTitulo.value,
            descricao: mudarDescricao.value
        }
        console.log(novoDado);
        modal.close();
        atualizarTarefa(novoDado);
        pai.querySelector(".titulo-tarefa").innerText = novoDado.title;
        pai.querySelector(".descricao").innerText = novoDado.descricao;

    }
}


async function atualizarTarefa(todo) {

    if (todo.id > 200) {
        console.log("usuário sem ser da api");
    } else {
        const request = await fetch(`https://jsonplaceholder.typicode.com/todos/${todo.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(todo)
        });

        if (!request.ok) {
            console.log("erro da net");
        } else {
            const data = await request.json();
            console.log(data);
            return data;
        }

    }
}




function pesquisarTarefasUser() {
    pesquisar.onclick = (e) => {

        const id = Number(inputPesquisar.value);

        // if (isNaN(id) || id === 0 || id > 10) { // tratei aq por preguça mas dá pra tratar no getAllToDosOfUser
        //     document.querySelector('.input-pesquisa-container').classList.add('input-pesquisa-container-erro');
        // } else {
            pegarTarefasDeUmUser(id);
        //     document.querySelector('.input-pesquisa-container').classList.remove('input-pesquisa-container-erro');
        // }

    }

}

async function pegarTarefasDeUmUser(userId) {

    carregando.style.display = "block";
    containerTarefas.style.display = "none"

    
    const request = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/todos`)
    if (!request.ok) {
        console.log("erro na pesquisa");
    } else {
        const resposta = await request.json();
        containerTarefas.innerHTML = "";
        for (let item of resposta) {
            containerTarefas.insertAdjacentHTML('afterbegin',
                `<div class="tarefa">
                    <div class="tarefa-textos">
                    <div class="id-e-titulo">
                        <p class="id-usuario">Usuário: ${item.userId} - </p>
                        <h2 class="titulo-tarefa"> ${item.title} </h2>
                    </div>
                        <p class="descricao">Sem descrição</p>
                    </div>
                   
                    <div class="tarefa-botaos"> 
                        <button class="completar"><img src="./imgs/icons8-done-30.png"
                                alt=""></button>
                        <button class="editar"><img src="./imgs/icons8-edit-30.png" alt=""></button>
                        <button class="deletar"><img src="./imgs/icons8-delete-24.png" alt=""></button>
                    </div>

                </div>`);
        }

        document.querySelectorAll(".tarefa").forEach((item, index) => {

            if (resposta[index].completed) {

                item.querySelector('.titulo-tarefa').style.textDecoration = "line-through";
                item.querySelector(".id-usuario").style.textDecoration = "line-through";
                item.querySelector(".descricao").style.textDecoration = "line-through";
            } else {
                item.querySelector('.titulo-tarefa').style.textDecoration = "none";
                item.querySelector('.id-usuario').style.textDecoration = "none";
                item.querySelector(".descricao").style.textDecoration = "none";
            }
        })

        document.querySelectorAll(".editar").forEach((item, index) => {

            item.onclick = () => {
                const divPai = item.parentElement.parentElement;
                const dados = {
                    id: resposta[resposta.length-index -1].id,
                    userId: resposta[resposta.length-index -1].userId,
                    completed: resposta[resposta.length-index -1].completed,
                    title: divPai.querySelector("h2").innerText,
                    descricao: divPai.querySelector(".descricao").innerText 
                }
                console.log(dados);
                mostrarModalEditar(dados, divPai);
            }
        })
        document.querySelectorAll(".deletar").forEach((item, index) => {

            item.onclick = () => {
                deletarTarefa(data[index].id);
                const pai = item.parentElement.parentElement;
                pai.remove();
            }
        })
        document.querySelectorAll(".completar").forEach((item, index) => {

            item.onclick = () => {
                let completa = !resposta[index].completed;
                completarTarefa(resposta[index].id, completa);
                resposta[index].completed = completa;

                const divPai = item.parentElement.parentElement;
            if (completa) {
                divPai.querySelector('.titulo-tarefa').style.textDecoration = "line-through";
                divPai.querySelector(".id-usuario").style.textDecoration = "line-through";
                divPai.querySelector(".descricao").style.textDecoration = "line-through";
            } else {
                divPai.querySelector('.titulo-tarefa').style.textDecoration = "none";
                divPai.querySelector('.id-usuario').style.textDecoration = "none";
                divPai.querySelector(".descricao").style.textDecoration = "none";
            }
            }
        })

        carregando.style.display = "none";
        containerTarefas.style.display = "block"

    }
}