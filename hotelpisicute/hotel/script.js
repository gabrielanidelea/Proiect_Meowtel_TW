const body = document.getElementById('body');
const main = document.getElementById('main');

const mainLink = document.getElementById('main-link');
const playgroundLink = document.getElementById('playground-link');
const acomodareLink = document.getElementById('acomodare-link');
const pisiciCazateLink = document.getElementById('pisici-cazate-link');
const rezervariLink = document.getElementById('rezervari-link');

mainLink.addEventListener('click', renderMainPage);
acomodareLink.addEventListener('click', renderAcomodarePage);
playgroundLink.addEventListener('click', renderPlaygroundPage);
pisiciCazateLink.addEventListener('click', renderPisiciListPage);
rezervariLink.addEventListener('click', renderRezervariPage);

const formNume = document.getElementById('formNume');
const formImgUrl = document.getElementById('formImgUrl');

let saveButton = document.getElementById('save');
const cancelButton = document.getElementById('cancel');

function renderMainPage() {
    removeNodesFromDOM(); // functie pentru stergerea nodului principal
    let mainDOMNode = createMainDOMNodes();
    main.appendChild(mainDOMNode); // duce in main chestiile create
}

function removeNodesFromDOM() {
    while (main.firstChild) {
        main.removeChild(main.firstChild);
    }
}

function createMainDOMNodes() {
    // Titlu
    let title = document.createElement('h1');
    title.className = "tit";
    title.textContent = 'Meowtel';

    // Imagine
    let img = document.createElement('img');
    img.className = "imaged"
    img.src = "https://i.pinimg.com/originals/76/e0/d5/76e0d51b8dc6c477cf821ebdc1dac9e2.jpg";

    // Paragraf
    let paragraph = document.createElement('p');
    paragraph.className = "paragrafemoewtel"
    paragraph.textContent = "Vă invităm animăluțul de companie la Hotelul nostru select, în timp ce dumneavoastră vă bucurați de concediul mult dorit. Beneficiem de o gamă largă de opțiuni pentru micuțul blănos, rămas în grija angajaților noștrii, adevărați iubitori de animale. Hotelul nostru dispune de locuri de joacă, babysitteri, igienizare zilică, spații de relaxare și, bineînțeles, camere spațioase. Ne dorim ca experiența traită de pisica dumneavoastră să fie una cât mai încântătoare.";

    // Paragraf container
    let paragraphContainer = document.createElement('div');
    paragraphContainer.className = "photeledit";
    paragraphContainer.appendChild(paragraph);

    let mainNode = document.createElement('meowtel');
    mainNode.appendChild(title);
    mainNode.appendChild(paragraphContainer);
    mainNode.appendChild(img);
    return mainNode;
}

function renderPisiciListPage(pisici) {

    removeNodesFromDOM();
    //Adaugare buton
    let addButton = document.createElement('button');
    addButton.className = "button-add";
    addButton.addEventListener('click', openAddModalPisica);
    addButton.textContent = " + Adăugați o pisică";

    // Asezarea butonului
    let addButtonContainer = document.createElement('div');
    addButtonContainer.className = "add__container";
    addButtonContainer.appendChild(addButton);
    main.appendChild(addButtonContainer);

    // Titlu
    let title = document.createElement('h1');
    title.className = "tit";
    title.textContent = "Pisici cazate";
    main.appendChild(title);

    fetch('http://localhost:3010/pisici')
        .then(function(response) {
            // Trasform server response to plain object
            response.json().then(function(pisici) {
                for (let i = 0; i < pisici.length; i++) {
                    let pisicaDOMNode = createPisiciListDOMNodes(pisici[i]); // citeste pisicile din fisierul json
                    console.log(pisicaDOMNode);
                    main.appendChild(pisicaDOMNode);
                }
            });
        });
}

function createPisiciListDOMNodes(pisica) {

    // Nume pisica
    let title = document.createElement('h3');
    title.className = "titlu";
    title.textContent = pisica.nume; //iau din json pisica.nume

    // Edit button
    let editButton = document.createElement('button');
    editButton.className = "button-edit";
    editButton.addEventListener('click', function() {
        openEditModalPisica(pisica); //apelez fct modala pt edit
    });
    editButton.textContent = 'Editați';

    // Delete button
    let deleteButton = document.createElement('button');
    deleteButton.className = "button-delete";

    deleteButton.addEventListener('click', function() {
        deletePisica(pisica.id);
    });
    deleteButton.textContent = 'Ștergeți';

    // Buttons container
    let buttonsContainer = document.createElement('div');
    buttonsContainer.className = "actions__container";
    buttonsContainer.appendChild(editButton);
    buttonsContainer.appendChild(deleteButton);

    // Image
    let img = document.createElement('img');
    img.className = "imgPisica";
    img.src = pisica.imgUrl;

    let pisicaListNode = document.createElement('pisica');
    pisicaListNode.appendChild(title);
    pisicaListNode.appendChild(img);
    pisicaListNode.appendChild(buttonsContainer);
    return pisicaListNode;
}

function openAddModalPisica() { //cand intru cu add pisica

    clearSaveButtonEvents();

    saveButton.addEventListener('click', function() {
        addPisica()
    });

    cancelButton.addEventListener('click', function() {
        body.className = 'hide-modal';
    });

    body.className = 'show-modal';
}

function openEditModalPisica(pisica) { // cand dau pe edit se apeleaza update
    clearSaveButtonEvents();
    formNume.value = pisica.nume;
    formImgUrl.value = pisica.imgUrl;

    saveButton = document.getElementById('save');
    closeButton = document.getElementById('cancel');

    saveButton.addEventListener('click', function() {
        updatePisica(pisica.id)
    });

    closeButton.addEventListener('click', function() {
        body.className = 'hide-modal';
    });

    body.className = 'show-modal';
}

function addPisica() {
    const postPisica = {
            nume: formNume.value,
            imgUrl: formImgUrl.value,
        }
        // pt postarea unei noi pisici
    fetch('http://localhost:3010/pisici', {
        method: 'post', //apelez metoda de post din backend
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(postPisica)
    }).then(function() {
        renderPisiciListPage(); // pt a afisa si noua pisica in lista

        formNume.value = '';
        formImgUrl.value = '';

        body.className = 'hide-modal';
    });
}

function updatePisica(id) {
    // pt editarea unei pisici existente
    const putPisica = {
            nume: formNume.value,
            imgUrl: formImgUrl.value
        }
        // Call put request to update the article
    fetch(`http://localhost:3010/pisici/${id}`, {
        method: 'PUT',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(putPisica)
    }).then(function() {
        removeNodesFromDOM();
        renderPisiciListPage();

        formNume.value = '';
        formImgUrl.value = '';

        body.className = 'hide-modal';
    });
}


function clearSaveButtonEvents() {
    let newUpdateButton = saveButton.cloneNode(true);
    saveButton.parentNode.replaceChild(newUpdateButton, saveButton);
    saveButton = document.getElementById('save');
}

function deletePisica(id) { //fct pt stergere
    fetch(`http://localhost:3010/pisici/${id}`, {
        method: 'DELETE',
    }).then(function() {
        renderPisiciListPage();
    });
}

function renderPlaygroundPage() {
    removeNodesFromDOM();

    let playgroundDOMNode = createPlaygroundDOMNodes();
    main.appendChild(playgroundDOMNode);
}

function createPlaygroundDOMNodes() {

    // Title
    let title = document.createElement('h2');
    title.className = "tit";
    title.textContent = 'Playground';

    // Image
    let img = document.createElement('img');
    img.className = "imaged"
    img.src = "https://s1.cel.ro/images/mari/2020/06/09/ansamblu-joaca-pisici-cu-hamac-casuta-si-jucarie-de-sisal-xxl-gri-deschis-h-154-cm-pct86w.jpg";

    // Paragraf
    let paragraph = document.createElement('p');
    paragraph.textContent = "Hotelul nostru este construit astfel încât animaluțul dumneavoastră să aibă un spațiu generos de joacă. Ansamblurile de joacă sunt amplasate atât în interiorul camerei, cât și în recepția destinată delectării blănoșilor. Spațiile de joacă sunt prevăzute cu sisteme de protecție, garantând siguranță.Fiecare ansamblu de joacă (atât cele personale, cât și cele comune) permit necuvântătoarelor să simtă libertate. Personalul nostru verifică, la un interval de timp strict ales, bunăstarea animalelor.Pe lângă faptul că animaluțele se vor bucura de un timp minunat alături de noi, dumneavoastră vă veți putea petrece concediul fără grijă, fiindcă Hotelul nostru select garantează tot confortul de care o pisică are nevoie.";


    // Paragraph container
    let paragraphContainer = document.createElement('div');
    paragraphContainer.className = "photeledit";
    paragraphContainer.appendChild(paragraph);

    let playgroundNode = document.createElement('playground');
    playgroundNode.appendChild(title);
    playgroundNode.appendChild(paragraphContainer);
    playgroundNode.appendChild(img);
    return playgroundNode;
}

function renderAcomodarePage() {
    removeNodesFromDOM();

    let acomodareDOMNode = createAcomodareDOMNodes();
    main.appendChild(acomodareDOMNode);
}

function createAcomodareDOMNodes() {

    // Title
    let title = document.createElement('h2');
    title.className = "tit";
    title.textContent = 'Acomodare';

    // Image
    let img = document.createElement('img');
    img.className = "imaged"
    img.src = "https://www.bucksherald.co.uk/sttms.blob.core.windows.net/images/T0FLMTIxMDQ2NDIx.jpg?width=640";

    // Paragraf
    let paragraph = document.createElement('p');
    paragraph.textContent = "Cazarea pisicilor se va face în camere încăpătoare, prevazute cu 2,9 metri pătrați de grădină. Astfel, micuțele necuvântătoare se vor putea delecta cu aer curat și lumină solară. Cu acordul dumneavoastră, li se va acorda oportunitatea de a interacționa cu ceilalți blănoși, sub supravegherea personalului autorizat. Hotelul nostru se află, de asemenea, într-o zonă ultra-centrală, în apropierea metroului Piața Unirii. Locația noastră vă permite cazarea și preluarea animaluțului cu ușurință.";

    //paragraf 2
    let paragraph2 = document.createElement('p');
    paragraph2.className = "subtit"
    paragraph2.textContent = "Adresă: Bulevardul Unirii 36"

    // Paragraf container
    let paragraphContainer = document.createElement('div');
    paragraphContainer.className = "photeledit";
    paragraphContainer.appendChild(paragraph);
    paragraphContainer.appendChild(paragraph2);

    let acomodareNode = document.createElement('acomodare');
    acomodareNode.appendChild(title);
    acomodareNode.appendChild(paragraphContainer);
    acomodareNode.appendChild(img);
    return acomodareNode;
}



function renderRezervariPage() {
    removeNodesFromDOM();

    let rezervariDOMNode = createRezervariDOMNodes();
    main.appendChild(rezervariDOMNode);
}

function createRezervariDOMNodes() {

    // Title
    let title = document.createElement('h2');
    title.className = "tit";
    title.textContent = 'Rezervare';

    // let paragraf=document.createElement('p');

    // Form
    let form = document.createElement('form');
    form.setAttribute("id", "formrez");
    form.className = "rezerv";

    //    label nume
    let nameLabel = document.createElement("label");
    nameLabel.setAttribute("for", "name");
    nameLabel.textContent = "Nume";
    form.appendChild(nameLabel);
    //    input nume
    let name = document.createElement("input");
    name.setAttribute("type", "text");
    name.setAttribute("id", "name");
    name.setAttribute("placeholder", "Numele dumneavoastră");
    name.setAttribute("required", "true");
    name.className = "listaoptiuni";
    form.appendChild(name);

    // form prenume
    let surnameLabel = document.createElement("label");
    surnameLabel.setAttribute("for", "surname");
    surnameLabel.textContent = "Prenume";
    form.appendChild(surnameLabel);
    // input prenume
    let surname = document.createElement("input");
    surname.setAttribute("type", "text");
    surname.setAttribute("id", "surname");
    surname.setAttribute("placeholder", "Prenumele dumneavoastră");
    surname.setAttribute("required", "true");
    surname.className = "listaoptiuni";
    form.appendChild(surname);

    // label email
    let emailLabel = document.createElement("label");
    emailLabel.setAttribute("for", "email");
    emailLabel.textContent = "Email";
    form.appendChild(emailLabel);
    // input email
    let email = document.createElement("input");
    email.setAttribute("type", "email");
    email.setAttribute("id", "email");
    email.setAttribute("placeholder", "nume.prenume@gmail.com");
    email.setAttribute("required", "true");
    email.className = "listaoptiuni";
    form.appendChild(email);

    // label telefon
    let phoneLabel = document.createElement("label");
    phoneLabel.setAttribute("for", "phone");
    phoneLabel.textContent = "Telefon";
    form.appendChild(phoneLabel);
    //    input phone
    let phone = document.createElement("input");
    phone.setAttribute("type", "phone");
    phone.setAttribute("id", "phone");
    phone.setAttribute("placeholder", "0773444333");
    phone.setAttribute("required", "true");
    phone.className = "listaoptiuni";
    form.appendChild(phone);

    //    label numePisica
    let numePisicaLabel = document.createElement("label");
    numePisicaLabel.setAttribute("for", "namePisica");
    numePisicaLabel.textContent = "Nume Blănos";
    form.appendChild(numePisicaLabel);
    //    input numePisica
    let namePisica = document.createElement("input");
    namePisica.setAttribute("type", "text");
    namePisica.setAttribute("id", "namePisica");
    namePisica.setAttribute("placeholder", "Nume Blănos");
    namePisica.setAttribute("required", "true");
    namePisica.className = "listaoptiuni";
    form.appendChild(namePisica);

    //    label varsta
    let varstaLabel = document.createElement("label");
    varstaLabel.setAttribute("for", "Vârsta");
    varstaLabel.textContent = "Vârstă";
    form.appendChild(varstaLabel);
    //    input varsta
    let varsta = document.createElement("input");
    varsta.setAttribute("type", "text");
    varsta.setAttribute("id", "varsta");
    varsta.setAttribute("placeholder", "Vârstă");
    varsta.setAttribute("required", "true");
    varsta.className = "listaoptiuni";
    form.appendChild(varsta);

    //    label rasa
    let rasaLabel = document.createElement("label");
    rasaLabel.setAttribute("for", "rasa");
    rasaLabel.textContent = "Rasă";
    form.appendChild(rasaLabel);
    //    input rasa
    let rasa = document.createElement("input");
    rasa.setAttribute("type", "text");
    rasa.setAttribute("id", "rasa");
    rasa.setAttribute("placeholder", "Rasă");
    rasa.setAttribute("required", "true");
    rasa.className = "listaoptiuni";
    form.appendChild(rasa);

    //    label checkindate
    let checkindateLabel = document.createElement("label");
    checkindateLabel.setAttribute("for", "checkindate");
    checkindateLabel.textContent = "Check-in";
    form.appendChild(checkindateLabel);
    //    input checkindate
    let checkindate = document.createElement("input");
    checkindate.setAttribute("type", "date");
    checkindate.setAttribute("id", "checkindate");
    checkindate.setAttribute("required", "true");
    checkindate.className = "listaoptiuni2";
    form.appendChild(checkindate);

    //    label checkoutdate
    let checkoutdateLabel = document.createElement("label");
    checkoutdateLabel.setAttribute("for", "checkoutdate");
    checkoutdateLabel.textContent = "Check-out";
    form.appendChild(checkoutdateLabel);
    //    input checkindate
    let checkoutdate = document.createElement("input");
    checkoutdate.setAttribute("type", "date");
    checkoutdate.setAttribute("id", "checkoutdate");
    checkoutdate.setAttribute("required", "true");
    checkoutdate.className = "listaoptiuni2";
    form.appendChild(checkoutdate);

    let str = '<div class="listaoptiuni"><label for="room-selection">Opțiune cameră</label><select id="room-selection" required><option value="">Alegeți tipul de cameră</option><option value="connecting">STANDARD (4.5 mp + 4,3 mp grădină)</option><option value="adjoining">SUPERIOARĂ (6.5 mp + 4,3 mp grădină)</option><option value="adjacent">DELUXE (12,09 mp + 6,3 mp grădină)</option></select><div>';
    form.insertAdjacentHTML('beforeend', str);


    let btnSaave = document.createElement("button");
    btnSaave.setAttribute("type", "submit");
    btnSaave.textContent = "Rezervați o Meowcameră";
    btnSaave.className = "button-add";
    form.appendChild(btnSaave);

    btnSaave.addEventListener('click', function() {
        alert('Vă mulțumim pentru rezervare!');
        name.value = '';
        surname.value = '';
        phone.value = '';
        email.value = '';
        namePisica.value = '';
        varsta.value = '';
        rasa.value = '';
        checkindate.value = '';
        checkoutdate.value = '';
        document.getElementById("room-selection").value = '';

    });


    let rezervareNode = document.createElement('rezervare');
    rezervareNode.appendChild(title);
    rezervareNode.appendChild(form);
    return rezervareNode;
}







renderMainPage();