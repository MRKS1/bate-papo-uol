let nome = [];
let msgServidor = [];
let nomesNoServidor = [];
let nomeSelecionado = "Todos";
let tipoMensagem = "Público";
let visibilidade = "message";

const linkId = "2d2d5927-7ae4-4779-aa4c-ecc9d75b3856";



function addParticipante() {
	nome = prompt("Qual é o seu nome?");
	
	const participante = { name: nome };
	const promessaParticipante = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants/" + linkId, participante);
	
	promessaParticipante.then(tratarSucesso);
	promessaParticipante.catch(tratarErro);
}


function tratarSucesso(resposta) {
	pegarMsg();
}


function tratarErro(erro) {
	if (erro.response.status === 400) {
		alert("O nome já está sendo utilizado, insira um nome válido.")
		window.location.reload();
	};

}


function pegarParticipantes() {
	const promessaParticipantes = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants/" + linkId);
	promessaParticipantes.then(processarParticipantes);
}

function processarParticipantes(participantes) {
	nomesNoServidor = participantes.data;
	renderizarParticipantes();

}

function renderizarParticipantes() {
	const lugarLista = document.querySelector(".lista-participantes");
	
	lugarLista.innerHTML = `<li class="enviar-para" onclick="selecaoDivMsg(this)">
                        <div class="opcao">
                            <ion-icon name="people"></ion-icon>
                            <p class="nomeLista">Todos</p>
							<img src="imagens/check.png" class="hide"/>
                        </div>
                    </li>`;


	for (let i = 0; i < nomesNoServidor.length; i++) {

		if (nomesNoServidor[i].name !== nome) {
			lugarLista.innerHTML += `<li class="enviar-para">
							<div class="opcao" onclick="selecaoDivMsg(this)">
								<ion-icon name="person-circle"></ion-icon>
								<p class="nomeLista">${nomesNoServidor[i].name}</p>
								<img src="imagens/check.png" class="hide"/>
							</div>
						</li>
		`
		};
	};

}


function abrirConfig() {
	document.querySelector(".lowOpacity").classList.remove("hide");
	document.querySelector(".popup").classList.remove("hide");
}


function fecharConfig() {
	document.querySelector(".lowOpacity").classList.add("hide");
	document.querySelector(".popup").classList.add("hide");
}


function pegarMsg() {
	const promessaMsg = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages/" + linkId);
	promessaMsg.then(processarMensagens);
}

function processarMensagens(resposta) {
	msgServidor = resposta.data;
	renderizarMensagens();
}


function renderizarMensagens() {
	const listaMsg = document.querySelector(".mensagens");
	listaMsg.innerHTML = "";

	for (let i = 0; i < msgServidor.length; i++) {
		if (msgServidor[i].type === "status") {
			listaMsg.innerHTML += `<li>
                <div class="entrou">
                    <div class="data">(${msgServidor[i].time})</div>
                    <p class="nomeNegrito">${msgServidor[i].from}</p>
                    <p>${msgServidor[i].text}</p>
                </div>
             </li>
		`
		}
		else if (msgServidor[i].type === "private_message" && (msgServidor[i].to === nome || msgServidor[i].from === nome)) {
			listaMsg.innerHTML += `<li>
			<div class="mensagemEnviadaPrivada">
				<div class="data">(${msgServidor[i].time})</div>
				<p class="nomeNegrito">${msgServidor[i].from}</p>
				<p>reservadamente para</p>
				<p class="nomeNegrito">${msgServidor[i].to}:</p>
				<p>${msgServidor[i].text}</p>
			</div>
		 </li>
	`
		}
		else if (msgServidor[i].type === "message") {
			listaMsg.innerHTML += `<li>
			<div class="mensagemEnviada">
				<div class="data">(${msgServidor[i].time})</div>
				<p class="nomeNegrito">${msgServidor[i].from}</p>
				<p>para</p>
				<p class="nomeNegrito">${msgServidor[i].to}:</p>
				<p>${msgServidor[i].text}</p>
			</div>
		 </li>
	`
		};

	}

	listaMsg.innerHTML += `<p class="finalPagina"></p>`;
	descerTela();

}


function descerTela() {
	const listaTela = document.querySelector(".finalPagina");
	listaTela.scrollIntoView();

}


function addMsg() {
	let textoDigitado = document.querySelector(".entradaMensagem").value;

	const mensagemCaixa = {
		from: nome,
		to: nomeSelecionado,
		text: textoDigitado,
		type: visibilidade
	};
	const promessaAddMsg = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages/" + linkId, mensagemCaixa);
	promessaAddMsg.then(processarMensagensEnviada);
	document.querySelector(".entradaMensagem").value = "";
}


function selecao(itemNome) {
	const selecionadoAntes = document.querySelector(".selecionado");
	if (selecionadoAntes !== null) {
		selecionadoAntes.classList.remove("selecionado");
	};
	itemNome.classList.add("selecionado");
	nomeSelecionado = itemNome.innerHTML;
	trocarRodape();
}


function processarMensagensEnviada(resposta) {
	pegarMsg();
}


function selecaoDivMsg(itemDivTipo) {

	const tipoSelecionadoAntes = document.querySelector(".selecionado");
	const nomeListaSelecionado = itemDivTipo.querySelector(".nomeLista").innerHTML;
	const checkTipo = itemDivTipo.querySelector(".hide");

	nomeSelecionado = nomeListaSelecionado;

	if (tipoSelecionadoAntes !== null) {
		tipoSelecionadoAntes.classList.remove("selecionado");
	}
	itemDivTipo.classList.toggle("selecionado");
	checkTipo.classList.toggle("hide");
	visibilidadeMsg();
	trocarRodape();
}


function selecaoDivModo(modoSelecionado) {
	const modoSelecionadoAntes = document.querySelector(".selecionado");
	const modoListaSelecionado = modoSelecionado.querySelector(".modoEnvio").innerHTML;


	if (modoSelecionadoAntes !== null) {
		modoSelecionadoAntes.classList.remove("selecionado");
	};
	modoSelecionado.classList.toggle("selecionado");


	tipoMensagem = modoListaSelecionado;

	visibilidadeMsg();
	trocarRodape();
}


function visibilidadeMsg() {
	if (tipoMensagem === "Público") {
		visibilidade = "message";
	}
	else {
		visibilidade = "private_message";

	}
}

function trocarRodape() {
	const rodape = document.querySelector(".rodapeTexto");

	if (nomeSelecionado === "Todos") {
		rodape.innerHTML = `Enviando para ${nomeSelecionado} (Público)`;
		visibilidade = "message"
	}
	else {
		rodape.innerHTML = `Enviando para ${nomeSelecionado} (${tipoMensagem})`;
	}


}

function atualizarPagina() {
	setInterval(pegarMsg, 3000);
}


function updateParticipante() {
	const participante = { name: nome };
	const promessaUpdate = axios.post("https://mock-api.driven.com.br/api/v6/uol/status/" + linkId, participante);
	promessaUpdate.catch(tratarErroUpdate);
}


function tratarErroUpdate(erroUpdate) {
	if (erroUpdate.response.status === 400) {
		alert("Você saiu da sala.");
		window.location.reload();
	};
}


function atualizarPresenca() {
	setInterval(updateParticipante, 5000);
}


function atualizarParticipantes() {
	setInterval(pegarParticipantes, 3000);
}


pegarParticipantes();
addParticipante();
atualizarPagina();
atualizarPresenca();
atualizarParticipantes();

