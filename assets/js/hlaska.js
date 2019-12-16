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
        this.element.querySelectorAll(".like-icon.liked").forEach(e => e.innerHTML = "<i class=\"fas fa-heart\"></i>");
        this.element.querySelectorAll(".like-icon.not-liked").forEach(e => e.innerHTML = "<i class=\"far fa-heart\"></i>");
        this.element.querySelectorAll(".share").forEach(e => e.innerHTML = "<i class=\"fas fa-share\"></i>");
    }
}

class HlaskaArray extends Array {
    display() {
        document.querySelector("#quotes > .container").innerHTML = "";
        this.forEach(e => {e.display(); document.querySelector("#quotes > .container").appendChild(e.element);});
        setTimeout(() => this.forEach(e => e.displayIcons()), 10000);
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