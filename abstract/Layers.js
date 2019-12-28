class Layer {
    constructor(options){
        this.target = options.target;
        this.rect = this.target.getBoundingClientRect();
        this.width = this.rect.width;
        this.height = this.rect.height;
    }
}

class CanvasLayer extends Layer {
    constructor(options){
        super(options);
        this.canvas = document.createElement("canvas");
        this.canvas.style.position = "absolute";
        this.canvas.width = this.rect.width;
        this.canvas.height = this.rect.height;
        this.canvas.style.pointerEvents = "none";
        this.target.append(this.canvas);
    }
}

class HtmlLayer extends Layer {
    constructor(options){
        super(options);
        this.padding = GAME_CONFIG.guiPadding;
        this.div = document.createElement("div");
        this.leftPanel = this.initPanel("left");
        this.rightPanel = this.initPanel("right");
        this.fullPanel = this.initPanel("full");
        this.alertPanel = this.initPanel("alert");
        this.dialogPanel = this.initPanel("dialog");
        this.div.style.position = "absolute";
        this.div.style.top = "0px";
        this.div.style.left = "0px";
        this.div.style.width = this.rect.width + "px";
        this.div.style.height = this.rect.height + "px";
        this.div.style.pointerEvents = "none";
        options.buttons.forEach(this.appendButton.bind(this));
        options.elements.forEach(this.appendElement.bind(this));
        this.target.append(this.div);
        this.panelSlideDirections = {
            left: "left",
            right: "right",
            dialog: "bottom",
            full: "top",
            alert: "top"
        };
    }
    appendElement(elementOptions) {
        console.log('elementOptions === ',elementOptions);
        const div = document.createElement("div");
        div.style.position = "absolute";
        Object.keys(elementOptions.styles).forEach(key => {
            div.style[key] = elementOptions.styles[key];
        });
        this.div.appendChild(div);
        Utility.fetchPanel(elementOptions.html_panel, function(html){
            div.innerHTML = html;
        })
    }
    appendButton(buttonOptions) {
        const div = document.createElement("button");
        div.setAttribute("title", buttonOptions.title);
        div.className = buttonOptions.iconClass;
        div.style.position = "absolute";
        if(buttonOptions.location.top)div.style.top = buttonOptions.location.top;
        if(buttonOptions.location.right)div.style.right = buttonOptions.location.right;
        if(buttonOptions.location.bottom)div.style.bottom = buttonOptions.location.bottom;
        if(buttonOptions.location.left)div.style.left = buttonOptions.location.left;
        div.style.pointerEvents = "all";
        div.style.backgroundColor = GAME_CONFIG.iconButtonBackgroundColor;
        div.style.color = GAME_CONFIG.iconButtonFontColor;
        div.style.fontSize = GAME_CONFIG.iconButtonFontSize;
        div.style.opacity = GAME_CONFIG.iconButtonOpacity;
        div.style.width = GAME_CONFIG.iconButtonSize + "px";
        div.style.height = GAME_CONFIG.iconButtonSize + "px";
        div.style.border = "0px";
        div.style.outline = "none";
        div.style.cursor = "pointer";
        div.onmouseenter = function(){
            this.style.opacity = 1;
        }
        div.onmouseleave = function(){
            this.style.opacity = GAME_CONFIG.iconButtonOpacity;
        }
        div.onclick = function(){
            Utility.clickIconButton(buttonOptions);
        };
        this.div.appendChild(div);
    }
    showPanel(name, html) {
        const panelKey = `${name}Panel`;
        this[panelKey].innerHTML = html;
        const dir = this.panelSlideDirections[name];
        if(dir) {
            if(["left","right"].includes(name)) {
                this[panelKey].style[dir] = this.padding + "px";
            } else {
                this[panelKey].style[dir] = "14.4%";
            }
        }
        this[panelKey].style[name] = 1;
        this[panelKey].style.opacity = 1;
    }
    hidePanel(name) {
        const panelKey = `${name}Panel`;
        const dir = this.panelSlideDirections[name];
        if(dir) {
            this[panelKey].style[dir] = "0px";
        }
        this[panelKey].style.opacity = 0;
    }
    initPanel(name) {
        const panel = document.createElement("div");
        panel.style.position = "absolute";
        panel.style.transition = "all 400ms";
        switch(name){
            case "left":
                panel.style.top = "14.4%";
                panel.style.left = "0%";
                panel.style.bottom = "14.4%";
                panel.style.width = "38%";
                break;
            case "right":
                panel.style.top = "14.4%";
                panel.style.width = "38%";
                panel.style.bottom = "14.4%";
                panel.style.right = "0%";
                break;
            case "full":
                panel.style.top = "0%";
                panel.style.left = this.padding + "px";
                panel.style.height = "68%";
                panel.style.right = this.padding + "px";
                break;
            case "alert":
                panel.style.top = "38%";
                panel.style.left = "38%";
                panel.style.height = "38%";
                panel.style.right = "38%";
                break;
            case "dialog":
                panel.style.height = "38%";
                panel.style.left = "14.4%";
                panel.style.bottom = "14.4%";
                panel.style.right = "14.4%";
                break;
        }
        panel.style.backgroundColor = GAME_CONFIG.guiBackgroundColor;
        panel.style.opacity = 0;
        this.div.append(panel);
        return panel;
    }
}

class ThreeLayer extends Layer {
    constructor(options){
        super(options);
        
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();

        /* not entirely sure what's going on with the next 4 lines */
        this.renderer.setSize(this.width, this.height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMapSoft = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;

        this.target.appendChild(this.renderer.domElement);

        this.characters = [];
        if(typeof options.initCharacters === "function") {
            options.initCharacters(this);
        } else {
            console.error("Your ThreeLayer needs an 'initCharacters' method");
        }

        this.worldObjects = [];
        if(typeof options.initWorld === "function") {
            options.initWorld(this);
        } else {
            console.error("Your ThreeLayer needs an 'initWorld' method");
        }

        if(typeof options.initLights === "function") {
            options.initLights(this);
        } else {
            console.error("Your ThreeLayer needs an 'initLights' method");
        }

        if(typeof options.initCamera === "function") {
            options.initCamera(this);
        } else {
            console.error("Your ThreeLayer needs an 'initCamera' method");
        }

        var floorGeometry = new THREE.PlaneGeometry(100, 100, 20, 20);
        var floorMaterial = new THREE.MeshPhongMaterial({
            color: 0xecebec,
            specular: 0x000000,
            shininess: 100
        });

        var floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -0.5 * Math.PI;
        floor.receiveShadow = true;
        this.scene.add(floor);

        this.ambientLight = new THREE.AmbientLight(0x090909);
        this.scene.add(this.ambientLight);

        var spotLight = new THREE.SpotLight(0xAAAAAA);
        spotLight.position.set(2, 3, 3);
        spotLight.castShadow = true;
        spotLight.shadow.bias = 0.0001;
        spotLight.shadow.mapSize.width = 2048; // Shadow Quality
        spotLight.shadow.mapSize.height = 2048; // Shadow Quality
        this.scene.add(spotLight);
    }
    render() {
        requestAnimationFrame(this.render.bind(this));
        this.cameraControls.update();
        this.renderer.render(this.scene, this.camera);
    }
}