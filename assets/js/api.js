class Api {
    constructor(url) {
        this.url = url.replace(/\/$/g, "");
    }
    fetchHlasky(filters) {
        return new Promise((resolve) => {
            let url = this.url + "/hlasky/";
            if (typeof filters !== "undefined") {
                if (typeof filters.filterByTeacher !== "undefined" && typeof filters.filterByDate !== "undefined") {
                    url = this.url + "/hlasky/" + "?filterByTeacher=" + filters.filterByTeacher + "&filterByDate=" + filters.filterByDate;
                } else if (typeof filters.filterByTeacher !== "undefined") {
                    url = this.url + "/hlasky/" + "?filterByTeacher=" + filters.filterByTeacher
                } else if (typeof filters.filterByDate !== "undefined") {
                    url = this.url + "/hlasky/" + "?filterByDate=" + filters.filterByDate;
                } else {
                    url = this.url + "/hlasky/";
                }
            }
            fetch(url).then((response) => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 404) {
                    modal("Hláška nenalezena.", "Neexistuje hláška, která by splňovala daná kritéria.", "danger", "OK").then(() => {
                        const newUrl = location.protocol + "//" + location.hostname
                        history.pushState({path: newUrl}, '', newUrl);
                        reload(api,hlaskaArray);
                    });
                }
            }).then(json => resolve(json));
        });
    }
    fetchHlaska(id) {
        return new Promise((resolve) => {
            fetch(this.url + "/hlasky/" + id).then((response) => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 404) {
                    modal("Hláška nenalezena.", "Hledaná hláška nebyla nalezena. Možná máte špatný odkaz nebo byla hláška odstraněna.", "danger", "OK").then(() => {
                        const newUrl = location.protocol + "//" + location.hostname
                        history.pushState({path: newUrl}, '', newUrl);
                        reload(api,hlaskaArray);
                    });
                }
            }).then(json => resolve(json));
        });
    }
    addLike(hlaska) {
        return new Promise((resolve) => {
            if (typeof Cookies.get('userId') === "undefined") {
                grecaptcha.execute(recaptchaSiteKey, {action: "newUser"}).then(token => {
                    return fetch(this.url + "/users/", {
                        method: "POST",
                        credentials: "same-origin",
                        headers: {
                            'g-recaptcha-response': token
                        }
                    });
                }).then(response => {
                    if (response.ok) {
                        this.addLike(hlaska).then(resolve);
                    } else {
                        if (response.status === 429) {
                            modal("Jste robot.", "ReCaptcha si myslí, že jste robot.", "danger", "OK");
                        }
                    }
                })
            } else {
                fetch(this.url + "/hlasky/" + hlaska.data.id + "/likes", {
                    method: "POST",
                    credentials: "same-origin"
                }).then((response) => {
                    if (response.ok) {
                        resolve();
                    } else {
                        if (response.status === 409) {
                            reload(api, hlaskaArray);
                        }
                    }
                });
            }
        });
    }
    removeLike(hlaska) {
        return new Promise((resolve) => {
            fetch(this.url + "/hlasky/" + hlaska.data.id + "/likes", {
                method: "DELETE",
                credentials: "same-origin"
            }).then((response) => {
                if (response.ok) {
                    resolve();
                } else {
                    if (response.status === 409) {
                        reload(api,hlaskaArray[0]);
                    }
                }
            });
        });
    }
    addQuote(password, data) {
        return new Promise((resolve, reject) => {
            grecaptcha.execute(recaptchaSiteKey, {action: "addQuote"}).then(token => {
                return fetch(this.url + "/hlasky", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Password': password,
                        'g-recaptcha-response': token
                    },
                    body: JSON.stringify(data)
                });
            }).then((response) => {
                if (response.ok) {
                    resolve();
                } else {
                    if (response.status === 429) {
                        modal("Jste robot.", "ReCaptcha si myslí, že jste robot.", "danger", "OK");
                    } else if (response.status === 401) {
                        modal("Špatné heslo.", "Zadali jste špatné heslo.", "danger", "OK");
                    }
                }
            });
        });
    }
    fetchTeachers() {
        return new Promise((resolve) => {
            fetch(this.url + "/teachers").then((response) => {
                return response.json();
            }).then(json => resolve(json));
        });
    }
    fetchUserLikes(userId) {
        return new Promise((resolve, reject) => {
            fetch(this.url + "/users/" + userId + "/likes").then((response) => {
                return response.json();
            }).then(json => resolve(json));
        });
    }
}