const hlaskaArray = [  ];
const api = new Api("/api/v2.0/");
const recaptchaSiteKey = "6LcxSaIUAAAAAB5ApbfGLvujSX4MffMAVXQz0bt5";
function escapeHTML(unsafeText) {
    let div = document.createElement('div');
    div.innerText = unsafeText;
    return div.innerHTML;
}
function toggleAddModal() {
    document.getElementById('addModal').classList.toggle('is-active');
}
function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
}
function removeAllOptions(select) {
    for(let i = select.options.length - 1 ; i >= 0 ; i--) {
        select.remove(i);
    }
}
function reload(api,hlaskaArray) {
    document.querySelector("#quotes > .container").innerHTML = "<div class=\"is-loading-ajax\"></div>";
    api.fetchTeachers().then(json => {
        Array.from(document.getElementsByClassName("teacherSelect")).forEach(e => {
            removeAllOptions(e);
            let option = document.createElement("option");
            option.innerText = "- Vyberte jméno profesora -";
            option.value = "";
            e.options.add(option);
            json.forEach(e1 => {
                let option = document.createElement("option");
                option.innerText = e1.firstName + " " + e1.lastName;
                option.value = e1.id;
                e.options.add(option);
            });
            e.options[0].selected = true;
        });
        if (/[?&]filterByTeacher=([^&]*)/g.exec(location.search)) {
            document.getElementById("searchTeacher").selectedIndex = [...document.getElementById("searchTeacher").options].filter(e => {
                return e.value === decodeURIComponent(/[?&]filterByTeacher=([^&]*)/g.exec(location.search)[1]);
            })[0].index;
        }
    });
    if (/[?&]id=([^&]*)/g.exec(location.search)) {
        api.fetchHlaska(decodeURIComponent(/[?&]id=([^&]*)/g.exec(location.search)[1])).then((json) => {
            hlaskaArray[0] = HlaskaArray.generateFromJson(json, api);
            if (typeof Cookies.get('userId') !== "undefined") {
                api.fetchUserLikes(Cookies.get('userId')).then((json) => {
                    for (let i = 0; i < hlaskaArray[0].length; i++) {
                        const idIndex = json.indexOf(hlaskaArray[0][i].data.id);
                        if (idIndex !== -1) {
                            hlaskaArray[0][i].liked = true;
                            json.splice(idIndex, 1);
                        }
                        if (json.length === 0) {
                            break;
                        }
                    }
                    hlaskaArray[0].display();
                });
            } else {
                hlaskaArray[0].display();
            }

        });
    } else {
        let filters = {};
        if (/[?&]filterByTeacher=([^&]*)/g.exec(location.search) && /[?&]filterByDate=([^&]*)/g.exec(location.search)) {
            filters = {
                filterByTeacher: decodeURIComponent(/[?&]filterByTeacher=([^&]*)/g.exec(location.search)[1]),
                filterByDate: decodeURIComponent(/[?&]filterByDate=([^&]*)/g.exec(location.search)[1])
            };
        } else if (/[?&]filterByTeacher=([^&]*)/g.exec(location.search)) {
            filters = {
                filterByTeacher: decodeURIComponent(/[?&]filterByTeacher=([^&]*)/g.exec(location.search)[1]),
            };
        } else if (/[?&]filterByDate=([^&]*)/g.exec(location.search)) {
            filters = {
                filterByDate: decodeURIComponent(/[?&]filterByDate=([^&]*)/g.exec(location.search)[1])
            };
        }
        if (/[?&]filterByDate=([^&]*)/g.exec(location.search)) {
            document.getElementById("searchDate").value = decodeURIComponent(/[?&]filterByDate=([^&]*)/g.exec(location.search)[1]);
        }
        api.fetchHlasky(filters).then((json) => {
            hlaskaArray[0] = HlaskaArray.generateFromJson(json, api);
            if (typeof Cookies.get('userId') !== "undefined") {
                api.fetchUserLikes(Cookies.get('userId')).then((json) => {
                    for (let i = 0; i < hlaskaArray[0].length; i++) {
                        const idIndex = json.indexOf(hlaskaArray[0][i].data.id);
                        if (idIndex !== -1) {
                            hlaskaArray[0][i].liked = true;
                            json.splice(idIndex, 1);
                        }
                        if (json.length === 0) {
                            break;
                        }
                    }
                    hlaskaArray[0].display();
                });
            } else {
                hlaskaArray[0].display();
            }

        });
    }
    document.querySelectorAll('#mainMenu, #mainMenuBurger').forEach((e) => {
        e.classList.remove('is-active');
    });
}
function submitQuote() {
    let valid = true;
    [...document.querySelectorAll("#addModal input, #addModal textarea, #addModal select")].forEach(e => {
        if ((e.value === "" && (e.id !== "dateInput" || !document.getElementById("addModalUnknownDate").checked))) {
            if (!e.closest(".field").querySelector("p.help")) {
                const hintP = document.createElement("p");
                hintP.innerText = "Políčko musí být vyplněné.";
                hintP.classList.add('help', 'is-danger');
                e.closest(".field").appendChild(hintP);
            }
            e.classList.add('is-danger');
            if (e.parentElement.matches("span.select")) {
                e.parentElement.classList.add('is-danger');
            }
            valid = false;
        } else {
            if (e.closest(".field").querySelector("p.help")) {
                e.closest(".field").removeChild(e.closest(".field").querySelector("p.help"));
            }
            e.classList.remove('is-danger');
            if (e.parentElement.matches("span.select")) {
                e.parentElement.classList.remove('is-danger');
            }
        }
    });
    if (!valid) return;
    const data = {
        teacher: document.getElementById("teacherSelect").value,
        content: document.getElementById("addModalContent").value,
        date: document.getElementById("addModalUnknownDate").checked ? null : document.getElementById("dateInput").value
    };
    api.addQuote(document.getElementById("addModalPassword").value, data).then(() => {
        toggleAddModal();
        reload(api,hlaskaArray);
    });

}
window.onpopstate = () => {
    reload(api,hlaskaArray);
};
document.addEventListener("DOMContentLoaded", () => {

    reload(api,hlaskaArray);


    document.getElementById("dateInput").disabled = document.querySelector("#unknownDateBox > input").checked;
    document.getElementById("unknownDateBox").addEventListener("click", () => {
        document.querySelector("#unknownDateBox > input").click();
    });
    document.querySelector("#unknownDateBox > input").addEventListener("click", (e) => {
        e.stopPropagation();
        document.getElementById("dateInput").disabled = !document.getElementById("dateInput").disabled;
    });
    [document.getElementById("searchTeacher"), document.getElementById("searchDate")].forEach(e => {
        e.onchange = () => {
            let queryPart = "";
            if (document.getElementById("searchTeacher").value !== "" && document.getElementById("searchDate").value !== "") {
                queryPart = "?filterByTeacher=" + document.getElementById("searchTeacher").value + "&filterByDate=" + document.getElementById("searchDate").value;
            } else if (document.getElementById("searchTeacher").value !== "") {
                queryPart = "?filterByTeacher=" + document.getElementById("searchTeacher").value;
            } else if (document.getElementById("searchDate").value !== "") {
                queryPart = "?filterByDate=" + document.getElementById("searchDate").value;
            }
            const newUrl = location.protocol + "//" + location.hostname + queryPart;
            history.pushState({path: newUrl}, '', newUrl);
            reload(api,hlaskaArray);
        }
    });

});
