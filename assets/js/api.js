class Api {
    constructor(url) {
        this.url = url.replace(/\/$/g, "");
    }
    fetchHlasky() {
        return new Promise((resolve) => {
            fetch(this.url + "/hlasky").then((response) => {
                return response.json();
            }).then(json => resolve(json));
        });
    }
    fetchHlaska(id) {
        return new Promise((resolve) => {
            fetch(this.url + "/hlasky/" + id).then((response) => {
                return response.json();
            }).then(json => resolve(json));
        });
    }
    addLike(hlaska) {
        return new Promise((resolve) => {
            fetch(this.url + "/hlasky/" + hlaska.data.id + "/likes", {
                method: "POST",
                credentials: "same-origin"
            }).then((response) => {
                if (response.ok) {
                    resolve();
                } else {
                    if (response.status === 409) {
                        reload();
                    }
                }
            });
        });
    }
    removeLike(quote) {
        return new Promise((resolve) => {
            fetch(this.url + "/hlasky/" + hlaska.data.id + "/likes", {
                method: "DELETE",
                credentials: "same-origin"
            }).then((response) => {
                if (response.ok) {
                    resolve();
                } else {
                    if (response.status === 409) {
                        reload();
                    }
                }
            });
        });
    }
    addQuote(password, data) {
        return new Promise((resolve, reject) => {
            fetch(this.url + "/hlasky", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'X-Password': password
                },
                body: JSON.stringify(data)
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
            return new Promise((resolve) => {
                fetch(this.url + "/users/" + userId + "/likes").then((response) => {
                    return response.json();
                }).then(json => resolve(json));
            });
        });
    }
}