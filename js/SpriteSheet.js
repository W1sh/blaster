/* Mantem-se um dicionario global de spritesheets. Cada entrada
   no dicionario contém uma instância da classe SpriteSheet
 
   O dicionario é indexado pelo URL da spritesheet/ atlas  onde o
   recurso está localizado.
   
   ex: var sp= gSpriteSheets['assets//grits_effects.png'] 
       irá devolver uma instancia de uma spritesheet ('assets//grits_effects.png')
       associado ao URL. (assumindo que a spritesheet existe)
*/
//-----------------------------------------
var gSpriteSheets = {}; // dicionario global de spritesheets

SpriteSheet = Class.extend(function () {

    var assetsLoaded = 0; // assets já carregados
    var _this = this; // auto-referencia
    this.img = null; // imagem da spritesheet/atlas
    this.url = ""; // url da spritesheet/atlas
    this.sprites = []; // array de todos os sprites capturados 
    var notify; // callback de notifição para sinalizar que tudo foi carregado

    //-----------------------------------------

    this.constructor = function () {};

    //-----------------------------------------  
    function assetLoaded(resourceName) {
        assetsLoaded++;
        if (assetsLoaded === 2) {
            gSpriteSheets[_this.url] = _this;
            notify();
        }
    }

    //-----------------------------------------
    // método que dá inicio ao processo de carregamento da spritesheet/atlas
    // parametros: url da imagem, url do ficheiro JSON, função a chamar quanfo termina o carregamento
    this.load = function (spriteSheetImage, spriteSheetJSON, callback) {
        var ajax = new AJAX(); // objeto para carregamento assíncrono de ficheiros 
        notify = callback;
        this.url = spriteSheetImage;
        var img = new Image();
        img.onload = function () {
            _this.img = img;
            assetLoaded("imagem"); // a imagem foi carregada
        };
        img.src = spriteSheetImage;
        // iniciar o carregamento do ficheiro JSON
        ajax.request(spriteSheetJSON, "GET", "text/html;charset=UTF-8", true,
            function (xhr) {
                _this.parseSpriteSheetDefinition(xhr.responseText);
            });
    };

    //-----------------------------------------
    // Define um sprite 
    this.defSprite = function (name, x, y, w, h, cx, cy) {
        var spt = {
            "id": name,
            "x": x,
            "y": y,
            "width": w,
            "height": h,
            "cx": cx == null ? 0 : cx,
            "cy": cy == null ? 0 : cy
        };
        // Armazenar o sprite no array de sprites
        this.sprites.push(spt);
    };

    //-----------------------------------------
    // Faz o Parse do ficheiro JSON associado à spritesheet/atlas.
    this.parseSpriteSheetDefinition = function (atlasJSON) {
        var atlas = JSON.parse(atlasJSON);
        for (var key in atlas.frames) {
            var x = atlas.frames[key].frame.x;
            var y = atlas.frames[key].frame.y;
            var w = atlas.frames[key].frame.w;
            var h = atlas.frames[key].frame.h;
            var cx = -Math.round(w / 2);
            var cy = -Math.round(h / 2);
            this.defSprite(key, x, y, w, h, cx, cy);
        }
        assetLoaded("json"); // assinalar que os sprites forma extraídos 
    };

    //-----------------------------------------
    // Obter os sprites associados a cada um dos estados da entidade, com base no nome do estado 
    this.getStats = function (name) {
        var statsFrames = [];
        for (var i = 0; i < this.sprites.length; i++) {
            var stName = new RegExp(name, "gi");
            if (this.sprites[i].id.match(stName)) {
                statsFrames.push(this.sprites[i]);
            }

        }
        return statsFrames;
    };
});