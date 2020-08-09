import { promises as fs, writeFile } from 'fs';

let estados = null;
let cidades = null;

let totalCidades = [];
let cidadesNome = [];
let cidadeMaiorN = [];
let cidadeMenorN = [];

estadosJson();

async function estadosJson() {
  try {
    estados = JSON.parse(await fs.readFile('./Estados.json'));
    cidades = JSON.parse(await fs.readFile('./Cidades.json'));

    estados.forEach((estado) => {
      let cidadeObj = cidades.filter((cidade) => {
        if (estado.ID === cidade.Estado) {
          return cidade;
        }
      });

      fs.writeFile(
        './estados-jsons/' + estado.Sigla + '.json',
        JSON.stringify(cidadeObj, null, 2)
      );
    });
    quantCidades();
  } catch (err) {
    console.log(err);
  }
}

async function quantCidades() {
  for (const estado of estados) {
    let estadoAtual = JSON.parse(
      await fs.readFile('./estados-jsons/' + estado.Sigla + '.json')
    );
    totalCidades.push({ uf: estado.Sigla, qtd: estadoAtual.length });
    console.log(estado.Sigla + '-' + estadoAtual.length);
  }
  checandoEstadosMaior();
}

function checandoEstadosMaior() {
  console.log('\n', 'Estados com mais cidades', '\n');
  const estadosMaisCi = totalCidades.sort((a, b) => b.qtd - a.qtd).slice(0, 5);
  for (const estado of estadosMaisCi) {
    console.log(estado.uf + ' - ' + estado.qtd);
  }
  checandoEstadosMenor();
}

function checandoEstadosMenor() {
  console.log('\n', 'Estados com menos cidades', '\n');
  const estadosMenosCi = totalCidades.sort((a, b) => a.qtd - b.qtd).slice(0, 5);
  for (const estado of estadosMenosCi) {
    console.log(estado.uf + ' - ' + estado.qtd);
  }
  cidadesMaiorNome();
}

async function cidadesMaiorNome() {
  console.log('\n', 'Cidades com nome mais longo de cada Estado', '\n');
  for (const estado of estados) {
    let estadoAtual = JSON.parse(
      await fs.readFile('./estados-jsons/' + estado.Sigla + '.json')
    );
    for (const cidade of estadoAtual) {
      cidadesNome.push({ uf: estado.Sigla, nome: cidade.Nome });
    }
    let cidadeObj = cidadesNome
      .filter((cidade) => {
        if (estado.Sigla === cidade.uf) {
          return cidade;
        }
      })
      .sort((a, b) => b.nome.length - a.nome.length)
      .slice(0, 1);
    cidadeMaiorN.push({ uf: cidadeObj[0].uf, nome: cidadeObj[0].nome });
    console.log(cidadeObj[0].uf + '-' + cidadeObj[0].nome);
  }
  cidadesMenorNome();
}

async function cidadesMenorNome() {
  console.log('\n', 'Cidades com o menor nome de cada Estado', '\n');
  for (const estado of estados) {
    let estadoAtual = JSON.parse(
      await fs.readFile('./estados-jsons/' + estado.Sigla + '.json')
    );
    for (const cidade of estadoAtual) {
      cidadesNome.push({ uf: estado.Sigla, nome: cidade.Nome });
    }
    let cidadeObj = cidadesNome
      .filter((cidade) => {
        if (estado.Sigla === cidade.uf) {
          return cidade;
        }
      })
      .sort((a, b) => a.nome.length - b.nome.length)
      .slice(0, 1);
    cidadeMenorN.push({ uf: cidadeObj[0].uf, nome: cidadeObj[0].nome });
    console.log(cidadeObj[0].uf + '-' + cidadeObj[0].nome);
  }
  cidadeMaiorNome();
}

function cidadeMaiorNome() {
  console.log('\n', 'Cidade com o maior nome', '\n');
  const ordNomes = cidadeMaiorN.sort((a, b) => b.nome.length - a.nome.length);
  console.log(ordNomes[0].uf + '-' + ordNomes[0].nome);
  cidadeMenorNome();
}


function cidadeMenorNome() {
  console.log('\n', 'Cidade com o menor nome', '\n');
  const ordNomes = cidadeMenorN.sort((a, b) => a.nome.length - b.nome.length);
  const menorNome = ordNomes[0].nome.length;
  const filtmenor = ordNomes
    .filter((cidade) => {
      if (cidade.nome.length === menorNome) {
        return cidade;
      }
    })
    .sort((a, b) => a.nome.localeCompare(b.nome));

  console.log(filtmenor[0].uf + '-' + filtmenor[0].nome);
}
