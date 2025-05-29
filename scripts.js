// scripts.js

function calcularTarifa() {
  const servico = document.getElementById("servico").value;
  const peso = parseFloat(document.getElementById("peso").value);
  const valorDeclarado = parseFloat(document.getElementById("valorDeclarado").value || 0);

  if (servico === "funerario") return calcularFunerario(peso);
  if (servico === "premium") return calcularPremium(peso, valorDeclarado);
  if (servico === "expresso") return calcularExpresso(peso, valorDeclarado);
  if (servico === "standard") return calcularStandard(peso);
  if (servico === "ecom") return calcularEcom(peso, valorDeclarado);
  if (servico === "servin") return calcularServin(peso, valorDeclarado);
}

function mostrarResultado(texto) {
  document.getElementById("resultado").innerText = texto;
}

function mostrarCampoValor() {
  const servico = document.getElementById("servico").value;
  document.getElementById("valorDeclaradoContainer").style.display = ["premium", "expresso", "ecom", "servin"].includes(servico) ? "block" : "none";
  document.getElementById("camposUF").style.display = servico === "standard" ? "none" : "block";
  document.getElementById("camposStandard").style.display = servico === "standard" ? "block" : "none";

  if (servico === "standard") {
    popularCamposStandard();
  } else {
    popularSelects();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("servico").value = "";
  popularSelects(); // inicializa selects vazios
});


function popularSelects() {
  const origem = document.getElementById("origem");
  const destino = document.getElementById("destino");
  const servico = document.getElementById("servico").value;
  let dados = [];
  if (servico === "funerario") dados = tabelaFunerario;
  else if (servico === "premium") dados = tabelaPremium;
  else if (servico === "expresso") dados = tabelaExpresso;
  else if (servico === "ecom") dados = tabelaEcomNormalizada;
  else if (servico === "servin") dados = tabelaServinNormalizada;
  else return;

  const origens = [...new Set(dados.map(r => r.origem).filter(Boolean))].sort();
  const destinos = [...new Set(dados.map(r => r.destino).filter(Boolean))].sort();
  origem.innerHTML = '<option value=""></option>' + origens.map(o => `<option value="${o}">${o}</option>`).join('');
  destino.innerHTML = '<option value=""></option>' + destinos.map(d => `<option value="${d}">${d}</option>`).join('');
}

function popularCamposStandard() {
  const siglaOrigem = document.getElementById("sigla_origem");
  const cidadeOrigem = document.getElementById("cidade_origem");
  const ufOrigem = document.getElementById("uf_origem");
  const siglaDestino = document.getElementById("sigla_destino");
  const cidadeDestino = document.getElementById("cidade_destino");
  const ufDestino = document.getElementById("uf_destino");

  const siglasOrigem = [...new Set(tabelaStandard.map(r => r.sigla_origem).filter(Boolean))].sort();
  const cidadesOrigem = [...new Set(tabelaStandard.map(r => r.cidade_origem).filter(Boolean))].sort();
  const ufsOrigem = [...new Set(tabelaStandard.map(r => r.uf_origem).filter(Boolean))].sort();
  const siglasDestino = [...new Set(tabelaStandard.map(r => r.sigla_destino).filter(Boolean))].sort();
  const cidadesDestino = [...new Set(tabelaStandard.map(r => r.cidade_destino).filter(Boolean))].sort();
  const ufsDestino = [...new Set(tabelaStandard.map(r => r.uf_destino).filter(Boolean))].sort();

  siglaOrigem.innerHTML = '<option value="">Selecione</option>' + siglasOrigem.map(v => `<option value="${v}">${v}</option>`).join('');
  cidadeOrigem.innerHTML = '<option value="">Selecione</option>' + cidadesOrigem.map(v => `<option value="${v}">${v}</option>`).join('');
  ufOrigem.innerHTML = '<option value="">Selecione</option>' + ufsOrigem.map(v => `<option value="${v}">${v}</option>`).join('');
  siglaDestino.innerHTML = '<option value="">Selecione</option>' + siglasDestino.map(v => `<option value="${v}">${v}</option>`).join('');
  cidadeDestino.innerHTML = '<option value="">Selecione</option>' + cidadesDestino.map(v => `<option value="${v}">${v}</option>`).join('');
  ufDestino.innerHTML = '<option value="">Selecione</option>' + ufsDestino.map(v => `<option value="${v}">${v}</option>`).join('');
}

if (!servico) return mostrarResultado("Selecione um serviço.");
if (isNaN(peso) || peso <= 0) return mostrarResultado("Informe um peso válido.");
