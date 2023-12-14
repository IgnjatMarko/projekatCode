let proizvodi;
let flag = 1;
let sort = 0;

document.querySelector("#tbDeoModel").addEventListener("keyup", filterChange);
document.querySelector("#rnCena").addEventListener("change", filterChange);
document.querySelector("#autorIzbor").addEventListener("change", filterChange);
document.querySelector('#checkPopust').addEventListener("change", filterChange);
document.querySelector("#sortMarka").addEventListener("click", function () {
  flag = 0;
  if (sort == 0) {
    sort = 1;
  } else {
    sort = 0;
  }

  filterChange();
});

function preuzmiPodatke() {
  let xHr = new XMLHttpRequest();

  xHr.addEventListener("readystatechange", function () {
    if (this.readyState == 4 && this.status == "200") {
      ispisiArtikle(JSON.parse(this.responseText));
      proizvodi = JSON.parse(this.responseText);
    }
  });
  xHr.open("GET", "assets/js/data.json");
  xHr.send();
}

function ispisiArtikle(data) {
  const element = document.querySelector("#artikli");

  data = filterText(data);
  data = filterCene(data);
  data = sortEl(data);
  data = filterAutor(data);
  data = sortPop(data);

  let ispis = ``;
  data.forEach((elem) => {
    ispis += `<div class="blok">
       <img src="${elem.slika.putanja}" alt="${elem.slika.alt}" />
       <h3>${elem.ime}</h3>
       <h5>Autor: ${elem.autor}</h5>
       <h5>${elem.tipMange} - ${elem.datum}</h5>
      `;

    if (elem.popust == 0) {
      ispis += `<h4>Cena: ${elem.cena}RSD</h4>`;
    } else {
      ispis += `<h3>Stara cena: <s>${elem.cena}RSD</s></h3>`;
      let novaCena = elem.cena - (elem.cena / 100) * elem.popust;
      ispis += `<h4>Nova cena: ${novaCena}RSD</h4>`;
    }

    if (elem.popust != 0) {
      ispis += `<h4 class="popustText"> Popust ${elem.popust}% !!!</h4>`;
    }
    ispis += `<a class="korpaText" href="#" data-id="${elem.id}">DODAJ U KORPU</a>
       </div>`;
  });
  if (data.length == 0) {
    element.innerHTML = "Nema artikala za zadati kriterijum";
  } else {
    element.innerHTML = ispis;
  }

  const dugmici = document.querySelectorAll(".korpaText");

  dugmici.forEach((elem) => {
    elem.addEventListener("click", prikaziModal);
  });
}

preuzmiPodatke();

function prikaziModal(e) {
  e.preventDefault();

  let id = parseInt(e.target.dataset.id);

  let elem = proizvodi.filter((elem) => id === elem.id)[0];

  let ispis = `
    <div class='modal-content blok'>
    <span class="close">&times;</span>
    <img src="${elem.slika.putanja}" alt="${elem.slika.alt}" />
       <h3>${elem.ime}, ${elem.tipMange},  ${elem.autor}</h3>
       <ul>
       <li>Format:${elem.specifikacije.format}</li>
       <li>Povez: ${elem.specifikacije.povez}</li>
       <li>Broj strana: ${elem.specifikacije.broj}</li>
       </ul>`;

  if (elem.popust == 0) {
    ispis += `<h6>Cena: ${elem.cena}RSD</h6>`;
  } else {
    ispis += `<h6><i>Stara cena: <s>${elem.cena}RSD</s></i></h6>`;
    let novaCena = elem.cena - (elem.cena / 100) * elem.popust;
    ispis += `<h6>Nova cena: <b>${novaCena}RSD</b></h6>`;
  }
  ispis += `<a class="korpaText" href="#" data-id="${elem.id}">DODAJ U KORPU</a>
       </div>`;

  document.querySelector("#modal").innerHTML = ispis;

  document.querySelector("#modal").style.display = "block";

  document.querySelector(".close").addEventListener("click", function () {
    document.querySelector("#modal").innerHTML = "";
    document.querySelector("#modal").style.display = "none";
  });
}

function filterChange() {
  ispisiArtikle(proizvodi);
}
function filterText(data) {
  const value = document.querySelector("#tbDeoModel").value;

  if (value != "") {
    let noviNiz = data.filter(function (elem) {
      if (
        elem.ime.toLowerCase().indexOf(value.trim().toLowerCase()) != -1 ||
        elem.autor.toLowerCase().indexOf(value.trim().toLowerCase()) != -1
      ) {
        return elem;
      }
    });

    return noviNiz;
  }

  return data;
}

function filterCene(data) {
  let cena = document.querySelector("#rnCena").value;

  document.querySelector("#cenaIzbor").textContent = cena;

  return data.filter(function (elem) {
    if (elem.popust == 0) {
      if (elem.cena <= cena) {
        return elem;
      }
    } else {
      let cenaPopu = elem.cena - (elem.cena * elem.popust) / 100;

      if (cenaPopu <= cena) {
        return elem;
      }
    }
  });
}

function sortEl(data) {
  if (sort == 1 && flag != 1) {
    data.sort((a, b) => {
      if (a.ime > b.ime) {
        return 1;
      }

      if (a.ime < b.ime) {
        return -1;
      }

      if (a.ime == b.ime) {
        return 0;
      }
    });

    document.querySelector("#sortMarka").value = "Sortiraj opadajuce";
    return data;
  } else if (sort == 0 && flag != 1) {
    data.sort((a, b) => {
      if (a.ime < b.ime) {
        return 1;
      }

      if (a.ime > b.ime) {
        return -1;
      }

      if (a.ime == b.ime) {
        return 0;
      }
    });

    document.querySelector("#sortMarka").value = "Sortiraj rastuce";
    return data;
  } else {
    return data;
  }
}

function filterAutor(data) {
  const tvorac = document.querySelector("#autorIzbor").value;

  if (tvorac != "") {
    let noviArray = data.filter(function (el) {
      if (el.autor.toLowerCase().indexOf(tvorac.trim().toLowerCase()) != -1) {
        return el;
      }
    });

    return noviArray;
  }

  return data;
}

function sortPop(data) {

    let checkBox = document.querySelector('#checkPopust');
    
    if (checkBox.checked) {
        console.log("Checkbox is checked..")

        return data.filter(function (elem) {
            if (elem.popust > 0) {
                return elem;
            }
        })
    }
    
    return data;

}