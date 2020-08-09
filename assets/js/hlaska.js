class Hlaska {
    like() {
        if (this.liked === false) {
            this.liked = true;
            this.likeButton.classList.toggle("liked");
            this.data.likes++;
            this.likeButton.querySelector(".n-likes").innerHTML = this.data.likes;
            this.api.addLike(this);
        } else {
            this.liked = false;
            this.likeButton.classList.toggle("liked");
            this.data.likes--;
            this.likeButton.querySelector(".n-likes").innerHTML = this.data.likes;
            this.api.removeLike(this);
        }
    }
    share() {
        modal("Sdílet",`<p>Zde je odkaz pro sdílení:</p><p><input class="shareInput input" type="text" value="${this.shareUrl}" readonly></p>`,"","Kopírovat", "Zavřít");
        document.getElementsByClassName("shareInput")[document.getElementsByClassName("shareInput").length-1].select();
    }
    constructor(data, api) {
        this.data = data;
        this.api = api;
        this.shareUrl = location.protocol + "//" + location.hostname + "?id=" + this.data.id;
        this.element = document.createElement("div");
        this.liked = false;
    }
    display() {
        this.element.innerHTML = `
        <div class="box quote">
            <div class="hlaska-content">
                <p><strong>${escapeHTML(this.data.teacher.firstName) + " " + escapeHTML(this.data.teacher.lastName)}</strong> &nbsp; <small>${isValidDate(new Date(this.data.date)) ? escapeHTML(new Date(this.data.date).toLocaleDateString()) : "<smaller class='has-text-grey-light'>Neznámé datum</smaller>"}</small></p>
                <p>${escapeHTML(this.data.content)}</p>
                <div class="level is-mobile">
                    <div class="level-left">
                        <div class="level-item">
                            <a class="likes${this.liked ? " liked": ""}">
                                <span class="like-icon liked">

                                </span>
                                <span class="like-icon not-liked">

                                </span>
                                <span class="n-likes">
                                    ${escapeHTML(this.data.likes)}
                                </span>
                            </a>
                        </div>
                        <div class="level-item">
                            <a class="share">
                                
                            </a>
                        </div>
                    </div>
                    <div class="level-right">
                        <span class="edited ${this.data.edited ? "active " : ""}has-text-grey-light" title="Hláška byla upravena administrátorem.">
                            <i class="fas fa-pen"></i>
                        </span>
                    </div>
                </div>
            </div>
        </div>     
        `;
        this.likeButton = this.element.querySelector(".likes");
        this.likeButton.addEventListener("click", () => this.like());
        this.shareButton = this.element.querySelector(".share");
        this.shareButton.addEventListener("click", () => this.share());
    }
    displayIcons() {
        this.element.querySelectorAll(".like-icon.liked").forEach(e => e.innerHTML = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="heart" class="svg-inline--fa fa-heart fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path></svg>`);
        this.element.querySelectorAll(".like-icon.not-liked").forEach(e => e.innerHTML = `<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="heart" class="svg-inline--fa fa-heart fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M458.4 64.3C400.6 15.7 311.3 23 256 79.3 200.7 23 111.4 15.6 53.6 64.3-21.6 127.6-10.6 230.8 43 285.5l175.4 178.7c10 10.2 23.4 15.9 37.6 15.9 14.3 0 27.6-5.6 37.6-15.8L469 285.6c53.5-54.7 64.7-157.9-10.6-221.3zm-23.6 187.5L259.4 430.5c-2.4 2.4-4.4 2.4-6.8 0L77.2 251.8c-36.5-37.2-43.9-107.6 7.3-150.7 38.9-32.7 98.9-27.8 136.5 10.5l35 35.7 35-35.7c37.8-38.5 97.8-43.2 136.5-10.6 51.1 43.1 43.5 113.9 7.3 150.8z"></path></svg>`);
        this.element.querySelectorAll(".share").forEach(e => e.innerHTML = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="share" class="svg-inline--fa fa-share fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M503.691 189.836L327.687 37.851C312.281 24.546 288 35.347 288 56.015v80.053C127.371 137.907 0 170.1 0 322.326c0 61.441 39.581 122.309 83.333 154.132 13.653 9.931 33.111-2.533 28.077-18.631C66.066 312.814 132.917 274.316 288 272.085V360c0 20.7 24.3 31.453 39.687 18.164l176.004-152c11.071-9.562 11.086-26.753 0-36.328z"></path></svg>`);
        /*
        this.element.querySelectorAll(".like-icon.liked").forEach(e => e.innerHTML = "<i class=\"fas fa-heart\"></i>");
        this.element.querySelectorAll(".like-icon.not-liked").forEach(e => e.innerHTML = "<i class=\"far fa-heart\"></i>");
        this.element.querySelectorAll(".share").forEach(e => e.innerHTML = "<i class=\"fas fa-share\"></i>");
        */
    }
}

class HlaskaArray extends Array {
    display() {
        document.querySelector("#quotes > .container").innerHTML = "";
        this.forEach(e => {e.display(); document.querySelector("#quotes > .container").appendChild(e.element);});
        // setTimeout(() => this.forEach(e => e.displayIcons()), 10000);
        this.displayIcons()
    }
    displayIcons() {
        this.forEach(e => e.displayIcons());
    }
    static generateFromJson(json, api) {
        let hlaskaArray = new HlaskaArray();
        for (let i = 0; i < json.length; i++) {
            hlaskaArray.push(new Hlaska(json[i], api));
        }
        return hlaskaArray;
    }
}
