class Card {
    large;
    doubleSided = false;
    tokens = false;
    constructor(name) {
        this.name = name;
        this.json = fetch ("https://api.scryfall.com/cards/named?fuzzy=" + this.name)
            .then(x => x.text())
            .then(y => JSON.parse(y));

        this.img = new Image();
        this.faces = [];
        this.json.then(a => {
            this.doubleSided = a.hasOwnProperty("card_faces");
            if (this.doubleSided) {
                this.faces = a.card_faces;
            }
            else {
                this.faces[0] = a;
            }
            this.tokens = a.hasOwnProperty("component");
            this.img.src = this.faces[0].image_uris.large;
        });
        this.img.style.maxWidth = "110%";

    }
}