// Gestione Tab
function openTab(tabName) {
    const tabs = document.querySelectorAll(".tab-content");
    tabs.forEach(tab => tab.style.display = "none");
  
    const currentTab = document.getElementById(tabName);
    if (currentTab) currentTab.style.display = "block";
  }
  
  // Funzione Calcolo Follow Prod
  function calcolaFollowProd() {
    let fusti = parseInt(document.getElementById("fustiDisponibili").value) || 0;
    let quintali = parseFloat(document.getElementById("quintaliDisponibili").value) || 0;
    let numeroEsatto = document.getElementById("numeroEsatto").checked;
  
    // Regole produzione
    const fustiPerOra = 120;
    const quintaliPerOra = 30;
  
    // Calcolo se la produzione è fattibile
    let fustiPossibiliDaQuintali = Math.floor((quintali * 100) / 25); // ogni fusto da 25L => 25Kg => 0,25 quintali
    let fustiFinali = Math.min(fusti, fustiPossibiliDaQuintali);
    let quintaliRimanenti = quintali - (fustiFinali * 25 / 100);
  
    let msg = `Puoi produrre ${fustiFinali} fusti da 25L.<br>`;
    msg += `Quintali rimanenti: ${quintaliRimanenti.toFixed(2)}.<br><br>`;
  
    // Calcolo bancali
    const fustiPerBancale = 8;
    let bancaliInteri = Math.floor(fustiFinali / fustiPerBancale);
    let fustiRimanenti = fustiFinali % fustiPerBancale;
  
    let configurazioneBancali = [];
    let risultatoBancali = "";
  
    if (fustiRimanenti === 0) {
      for (let i = 0; i < bancaliInteri; i++) configurazioneBancali.push(8);
    } else {
      if (numeroEsatto) {
        for (let i = 0; i < bancaliInteri; i++) configurazioneBancali.push(8);
        configurazioneBancali.push(fustiRimanenti);
      } else {
        for (let i = 0; i < bancaliInteri; i++) configurazioneBancali.push(8);
        configurazioneBancali.push(8); // Ultimo bancale comunque da 8 anche se ci sono meno fusti
      }
    }
  
    risultatoBancali = configurazioneBancali.join(" + ");
  
    msg += `Devi preparare i seguenti bancali: ${risultatoBancali} fusti per bancale.<br>`;
  
    // Salva stato in localStorage
    const stato = {
      fusti,
      quintali,
      numeroEsatto,
      fustiFinali,
      quintaliRimanenti,
      configurazioneBancali
    };
    localStorage.setItem("followProdState", JSON.stringify(stato));
  
    // Mostra il messaggio
    document.getElementById("risultatiFollowProd").innerHTML = msg;
  
    // Genera immagini dei bancali
    generaImmaginiBancali(configurazioneBancali);
  }
  
  function generaImmaginiBancali(configurazione) {
    const container = document.getElementById("bancaliImgContainer");
    container.innerHTML = "";
  
    configurazione.forEach((fusti, index) => {
      const bancaleDiv = document.createElement("div");
      bancaleDiv.className = "bancale-img";
      bancaleDiv.innerHTML = `${fusti} fusti`;
      container.appendChild(bancaleDiv);
    });
  }
  
  // Carica stato salvato al caricamento
  window.onload = function() {
    const savedState = JSON.parse(localStorage.getItem("followProdState"));
    if (savedState) {
      document.getElementById("fustiDisponibili").value = savedState.fusti;
      document.getElementById("quintaliDisponibili").value = savedState.quintali;
      document.getElementById("numeroEsatto").checked = savedState.numeroEsatto;
  
      document.getElementById("risultatiFollowProd").innerHTML =
        `Ultimo calcolo:<br>Puoi produrre ${savedState.fustiFinali} fusti da 25L.<br>Quintali rimanenti: ${savedState.quintaliRimanenti.toFixed(2)}.<br><br>Devi preparare i seguenti bancali: ${savedState.configurazioneBancali.join(" + ")} fusti per bancale.<br>`;
  
      generaImmaginiBancali(savedState.configurazioneBancali);
    }
  };
  