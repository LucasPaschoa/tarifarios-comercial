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

function popularSelects() {
  const origem = document.getElementById("origem");
  const destino = document.getElementById("destino");
  const servico = document.getElementById("servico").value;
  let dados = [];

  if (servico === "funerario") dados = tabelaFunerario;
  else if (servico === "premium") dados = tabelaPremium;
  else if (servico === "expresso") dados = tabelaExpresso;
  else if (servico === "ecom") dados = tabelaEcom;
  else if (servico === "servin") dados = tabelaServin;
  else return;

  const origens = [...new Set(dados.map(r => r.origem).filter(o => o !== "BR"))].sort();
  const destinos = [...new Set(dados.map(r => r.destino).filter(d => d !== "BR"))].sort();

  origem.innerHTML = '<option value=""></option>' + origens.map(o => `<option value="${o}">${o}</option>`).join('');
  destino.innerHTML = '<option value=""></option>' + destinos.map(d => `<option value="${d}">${d}</option>`).join('');
}

function mostrarCampoValor() {
  const servico = document.getElementById("servico").value;
  document.getElementById("valorDeclaradoContainer").style.display = (servico === "premium" || servico === "expresso" || servico === "ecom" || servico === "servin") ? "block" : "none";
  document.getElementById("camposUF").style.display = (servico === "standard") ? "none" : "block";
  document.getElementById("camposStandard").style.display = (servico === "standard") ? "block" : "none";

  if (servico === "standard") {
    popularCamposStandard();
  } else {
    popularSelects();
  }
}

document.addEventListener("DOMContentLoaded", mostrarCampoValor);
