const KEY = 'tibu0003'
let contacts = [];
const init = function () {
    if (!localStorage.getItem(KEY)) {
        contacts = myData;
        let str = JSON.stringify(myData);
        localStorage.setItem(KEY, str);
    } else {
        contacts = JSON.parse(localStorage.getItem(KEY));
    }
    updateList();

    document.querySelector('.fab').addEventListener('click', showForm);
    document.querySelector('#button-save').addEventListener('click', addContact);
    document.querySelector('#button-cancel').addEventListener('click', hideForm);
    document.querySelector('ul.contacts').addEventListener("click", openEditForm)

}

const openEditForm = function (ev) {
    if (ev.target.className != 'delete') {
        let id = ev.target.parentElement.getAttribute('data-id');
        let selectedContact = [];
        contacts.forEach((contact) => {
            if (contact.id == id) {
                selectedContact = contact;
            }
        });
        document.querySelector('#input-name').value = selectedContact.fullname;
        document.querySelector('#input-email').value = selectedContact.email;
        document.querySelector('#input-phone').value = selectedContact.phone;
        document.querySelector('#button-save').textContent = 'Save';
        document.querySelector('#button-save').setAttribute('data-id', id);
        showForm(ev);
    }
}

const updateList = function () {
    sortContacts();
    let ul = document.querySelector('ul.contacts');
    ul.innerHTML = "";
    let df = new DocumentFragment();
    contacts.forEach((contact) => {
        df.appendChild(createItem(contact));
    });
    ul.appendChild(df);
}
const getUniqueId = function () {
    let maxNo = 0;
    contacts.forEach((contact) => {
        if (parseInt(contact.id) > maxNo)
            maxNo = parseInt(contact.id);

    });
    return maxNo + 1;
}

const createItem = function (contact) {
    let li = document.createElement('li');
    li.setAttribute('data-id', contact.id);
    li.className = 'contact';
    let span = document.createElement('span');
    span.className = 'delete';
    span.setAttribute('data-key', contact.id);
    span.addEventListener('click', removeContact);
    li.appendChild(span);
    let h3 = document.createElement('h3');
    h3.textContent = contact.fullname;
    li.appendChild(h3);
    let p = document.createElement('p');
    p.className = 'email';
    p.textContent = contact.email;
    li.appendChild(p);
    let pp = document.createElement('p');
    pp.className = 'phone';
    pp.textContent = contact.phone;
    li.appendChild(pp);
    return li;
}

const showForm = function (ev) {
    ev.preventDefault();
    hideFormError();
    document.querySelector('main').style.opacity = '0';
    document.querySelector('.fab').style.opacity = '0';
    document.querySelector('.contactform').classList.add('active');
    document.querySelector('.overlay').style.display = 'block';

}

const hideForm = function (ev) {

    ev.preventDefault();
    document.querySelector('main').style.opacity = '1';
    document.querySelector('.fab').style.opacity = '1';
    document.querySelector('.contactform').classList.remove('active');
    document.querySelector('.overlay').style.display = 'none';
    document.querySelector('.contactform form').reset();
    document.querySelector('#button-save').textContent = 'Save';
    document.querySelector('#button-save').setAttribute('data-id', 0);
    sortContacts();
}

const addContact = function (ev) {
    ev.preventDefault();
    let fullname = document.querySelector('#input-name').value.trim();
    let email = document.querySelector('#input-email').value.trim();
    let phone = document.querySelector('#input-phone').value.trim();
    let btn = document.querySelector('#button-save');
    let dataId = parseInt(btn.getAttribute('data-id'));

    if (fullname && email && phone) {
        obj = {
            id: dataId ? dataId : getUniqueId(),
            fullname: fullname,
            email: email,
            phone: phone
        };
        let isDuplicated = false;
        if (dataId) {
            contacts.forEach((contact) => {
                if (contact.id == dataId) {
                    contact.fullname = obj.fullname;
                    contact.email = obj.email;
                    contact.phone = obj.phone;
                }
            });
        } else {
            if (!checkDuplicate(obj)) {
                isDuplicated = false;
                contacts.push(obj);
            } else {
                isDuplicated = true;

            }
        }
        if (!isDuplicated) {
            localStorage.setItem(KEY, JSON.stringify(contacts));
            //clear the form

            hideForm(new MouseEvent('click'));
            //reflect
            updateList();
        } else {
            showFormError('You really like this guy! you are trying to add it twice');
        }
    } else {
        //better as a non-modal div that removes itself
        showFormError('Come on, do not be lazy! Put name, phone number, and email, please.');
    }
}
const showFormError = function (msg) {
    let errDiv = document.querySelector('.error');
    errDiv.textContent = msg;
    errDiv.classList.add('active');
    //    alert(msg);
}
const hideFormError = function () {
    let errDiv = document.querySelector('.error');
    errDiv.classList.remove('active');
    errDiv.textContent = '';
}
const checkDuplicate = function (obj) {
    for (let i = 0; i < contacts.length; a++) {
        if (contacts[i].fullname == obj.fullname &&
            contacts[i].email == obj.email &&
            contacts[i].phone == obj.phone
        ) {
            return 1;
            break;
        } else
            return 0;
    }

}

const removeContact = function (ev) {
    ev.preventDefault();
    let id = ev.target.getAttribute('data-key');
    console.log(id);
    contacts = contacts.filter((contact) => {
        console.log(contact.id);
        return !(contact.id == id);
    });
    console.log(contacts);
    localStorage.setItem(KEY, JSON.stringify(contacts));
    updateList();
}

const sortContacts = function () {
    contacts.sort(function (a, b) {
        let nameA = a.fullname.toUpperCase();
        let nameB = b.fullname.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
}

document.addEventListener('DOMContentLoaded', init);
