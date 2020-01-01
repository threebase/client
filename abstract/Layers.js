class Layer {
    constructor(options) {
        this.target = options.target;
        this.rect = this.target.getBoundingClientRect();
        this.width = this.rect.width;
        this.height = this.rect.height;
    }
}

class CanvasLayer extends Layer {
    constructor(options) {
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
    constructor(options) {
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
        console.log('elementOptions === ', elementOptions);
        const div = document.createElement("div");
        div.style.position = "absolute";
        Object.keys(elementOptions.styles).forEach(key => {
            div.style[key] = elementOptions.styles[key];
        });
        this.div.appendChild(div);
        Utility.fetchPanel(elementOptions.html_panel, function (html) {
            div.innerHTML = html;
        })
    }
    appendButton(buttonOptions) {
        const div = document.createElement("button");
        div.setAttribute("title", buttonOptions.title);
        div.className = buttonOptions.iconClass;
        div.style.position = "absolute";
        if (buttonOptions.location.top) div.style.top = buttonOptions.location.top;
        if (buttonOptions.location.right) div.style.right = buttonOptions.location.right;
        if (buttonOptions.location.bottom) div.style.bottom = buttonOptions.location.bottom;
        if (buttonOptions.location.left) div.style.left = buttonOptions.location.left;
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
        div.onmouseenter = function () {
            this.style.opacity = 1;
        }
        div.onmouseleave = function () {
            this.style.opacity = GAME_CONFIG.iconButtonOpacity;
        }
        div.onclick = function () {
            Utility.clickIconButton(buttonOptions);
        };
        this.div.appendChild(div);
    }
    showPanel(name, html) {
        const panelKey = `${name}Panel`;
        this[panelKey].innerHTML = html;
        const dir = this.panelSlideDirections[name];
        if (dir) {
            if (["left", "right"].includes(name)) {
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
        if (dir) {
            this[panelKey].style[dir] = "0px";
        }
        this[panelKey].style.opacity = 0;
    }
    initPanel(name) {
        const panel = document.createElement("div");
        panel.style.position = "absolute";
        panel.style.transition = "all 400ms";
        switch (name) {
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

const spriteSheetTextureMap = {};
class OkraLayer extends Layer {
    constructor(options) {
        super(options);

        const keyboard = {
            _pressed: {},

            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40,

            isDown: function (keyCode) {
                return this._pressed[keyCode];
            },

            onKeydown: function (event) {
                // checkpos();
                this._pressed[event.keyCode] = true;
            },

            onKeyup: function (event) {
                heromaterial.map = idletexture;
                xnum = 0;
                count = 0;
                delete this._pressed[event.keyCode];
            }
        };

        const target = this.target;

        THREE.SpriteSheetTexture = function (
            id,
            imageURL,
            framesX,
            frameDelay,
            _endFrame
        ) {
            var frameWidth,
                frameHeight,
                x = 0,
                y = 0,
                count = 0,
                startFrame = 0,
                endFrame = _endFrame || framesX,
                canvas = document.createElement("canvas"),
                ctx = canvas.getContext("2d"),
                canvasTexture = new THREE.CanvasTexture(canvas),
                img = new Image();
            if (spriteSheetTextureMap[id]) {
                clearInterval(spriteSheetTextureMap[id].timer);
            }
            spriteSheetTextureMap[id] = {
                imageURL,
                framesX,
                frameDelay,
                _endFrame
            };
            img.onload = function () {
                canvas.width = frameWidth = img.width / framesX;
                canvas.height = frameHeight = img.height;
                spriteSheetTextureMap[id].timer = setInterval(nextFrame, frameDelay);
            };
            img.src = imageURL;

            function nextFrame() {
                count++;
                if (count >= endFrame) {
                    count = 0;
                }
                if(keyboard._pressed["39"])console.log('count === ',count);

                x = (count % framesX) * frameWidth;
                y = ((count / framesX) | 0) * frameHeight;
                ctx.clearRect(0, 0, frameWidth, frameHeight);
                ctx.drawImage(
                    img,
                    x,
                    y,
                    frameWidth,
                    frameHeight,
                    0,
                    0,
                    frameWidth,
                    frameHeight
                );

                canvasTexture.needsUpdate = true;
            }

            return canvasTexture;
        };

        var width = this.rect.width,
            height = this.rect.height;
        let camera, scene, renderer, geometry, texture, xmesh, controls, heromaterial, runtexture, idletexture;
        var xnum = 0;
        var count = 0;
        let cloudmaterial;
        let characternumber = 0;
        let timer = 0;

        function init() {
            renderer = new THREE.WebGLRenderer({
                antialias: true,
                transparent: true,
                alpha: true
            });
            renderer.setSize(width, height);
            target.appendChild(renderer.domElement);

            scene = new THREE.Scene();

            camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 3000);
            camera.position.z = 600;
            // camera.position.y = -10;
            scene.add(camera);
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enablePan = false;
            controls.maxDistance = 1600;
            controls.minDistance = 200;
            // controls.enabled = false;
            //
            const bgtexture = new THREE.TextureLoader().load('game/assets/bg.png');
            const bgback = new THREE.TextureLoader().load('game/assets/bgback.png');
            const clouds = new THREE.TextureLoader().load('game/assets/clouds.png');
            const ground = new THREE.TextureLoader().load('game/assets/ground.png');

            idletexture = new THREE.TextureLoader().load('game/assets/10idle.png');
            runtexture = new THREE.SpriteSheetTexture(
                "player",
                "game/assets/10run.png",
                4,
                100,
                4
            );

            ground.magFilter = THREE.NearestFilter;
            ground.minFilteer = THREE.NearestFilter;
            clouds.magFilter = THREE.NearestFilter;
            clouds.minFilteer = THREE.NearestFilter;
            bgback.magFilter = THREE.NearestFilter;
            bgback.minFilteer = THREE.NearestFilter;
            bgtexture.magFilter = THREE.NearestFilter;
            bgtexture.minFilteer = THREE.NearestFilter;
            idletexture.magFilter = THREE.NearestFilter;
            idletexture.minFilter = THREE.LinearMipMapLinearFilter;
            runtexture.magFilter = THREE.NearestFilter;
            runtexture.minFilter = THREE.LinearMipMapLinearFilter;

            heromaterial = new THREE.MeshBasicMaterial({
                map: idletexture,
                side: THREE.DoubleSide,
                transparent: true
            });
            const geometry = new THREE.PlaneGeometry(200, 200, 1);
            xmesh = new THREE.Mesh(geometry, heromaterial);
            xmesh.position.z = 20;
            xmesh.renderOrder = 1;
            scene.add(xmesh);
            //bg
            const bgmaterial = new THREE.MeshBasicMaterial({
                map: bgtexture,
                transparent: true
            });
            const bggeometry = new THREE.PlaneGeometry(3200, 800, 1);
            const bgmesh = new THREE.Mesh(bggeometry, bgmaterial);
            bgmesh.position.y = 200;
            // bgmesh.position.z=-1;
            scene.add(bgmesh);
            //bg back
            const bgbkmaterial = new THREE.MeshBasicMaterial({
                map: bgback,
                transparent: true
            });
            const bggeometry2 = new THREE.PlaneGeometry(3200, 800, 1);
            const bgmesh2 = new THREE.Mesh(bggeometry2, bgbkmaterial);
            bgmesh2.position.y = 200;
            bgmesh2.position.z = -200;
            scene.add(bgmesh2);
            // clouds
            clouds.wrapS = THREE.RepeatWrapping;
            cloudmaterial = new THREE.MeshBasicMaterial({
                map: clouds
            });

            const bggeometry3 = new THREE.PlaneGeometry(3200, 800, 1);
            const cloudmesh = new THREE.Mesh(bggeometry3, cloudmaterial);


            cloudmesh.position.y = 300;
            cloudmesh.position.z = -400;
            scene.add(cloudmesh);
            // ground
            const groundmaterial = new THREE.MeshBasicMaterial({
                map: ground
            });
            const bggeometry4 = new THREE.PlaneGeometry(3200, 800, 1);
            const cloudmesh2 = new THREE.Mesh(bggeometry4, groundmaterial);
            cloudmesh2.position.y = -106;
            cloudmesh2.position.z = 200;
            cloudmesh2.rotation.x = -Math.PI / 2;
            scene.add(cloudmesh2);
            // // twiggy
            //     twiggymaterial = new THREE.MeshBasicMaterial({
            //         map: twigidle
            //         ,transparent:true
            //     });  
            //     twiggymesh = new THREE.Mesh(geometry, twiggymaterial);
            //     twiggymesh.position.x = -650;
            //     twiggymesh.position.z = 60;
            //     twiggymesh.renderOrder = 2;
            //     scene.add(twiggymesh);
            //

            characternumber += 1;
            if (characternumber > 10) {
                characternumber = 1;
            }
            // xnum=0;
            // count = 0; 
            console.log(characternumber)
            runtexture = new THREE.SpriteSheetTexture(
                "player",
                'game/assets/' + characternumber + 'run.png',
                4,
                100,
                4
            );
            runtexture.magFilter = THREE.NearestFilter;
            runtexture.minFilteer = THREE.NearestFilter;


            idletexture = new THREE.TextureLoader().load('game/assets/' + characternumber + 'idle.png');
            idletexture.magFilter = THREE.NearestFilter;
            idletexture.minFilteer = THREE.NearestFilter;
            heromaterial.map = idletexture;
            timer = 0;

            window.addEventListener('resize', onWindowResize, false);
            window.addEventListener('keyup', function (event) {
                keyboard.onKeyup(event);
            }, false);
            window.addEventListener('keydown', function (event) {
                keyboard.onKeydown(event);
            }, false);

        } // init

        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
            playerupdate();
            // controls.update();
        }

        init();
        animate();


        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }


        // player movement update
        function playerupdate() {
            // if (keyboard.isDown(keyboard.UP)) {
            // }


            if (keyboard.isDown(keyboard.UP)) {
                xmesh.rotation.y = Math.PI;
                xmesh.position.z -= 5;
                // camera.position.x -= 5; 
                xnum++;
                heromaterial.map = runtexture;
            }
            if (keyboard.isDown(keyboard.DOWN)) {
                xmesh.rotation.y = Math.PI;
                xmesh.position.z += 5;
                // camera.position.x -= 5; 
                xnum++;
                heromaterial.map = runtexture;
            }
            if (keyboard.isDown(keyboard.LEFT)) {
                xmesh.rotation.y = Math.PI;
                xmesh.position.x -= 5;
                // camera.position.x -= 5; 
                xnum++;
                heromaterial.map = runtexture;
            }
            // if (keyboard.isDown(keyboard.DOWN)) moveDown();
            if (keyboard.isDown(keyboard.RIGHT)) {
                xmesh.position.x += 5;
                // camera.position.x += 5; 
                xmesh.rotation.y = 0;
                xnum++;
                heromaterial.map = runtexture;
            }
            // clouds animation
            cloudmaterial.map.offset.x -= 0.0001;
        }


        function next() {

            document.getElementById('speech').style.display = 'none';

            characternumber += 1;
            if (characternumber > 10) {
                characternumber = 1;
            }
            // xnum=0;
            // count = 0; 
            console.log(characternumber)
            runtexture = new THREE.SpriteSheetTexture(
                "player",
                'game/assets/' + characternumber + 'run.png',
                4,
                100,
                4
            );
            runtexture.magFilter = THREE.NearestFilter;
            runtexture.minFilteer = THREE.NearestFilter;


            idletexture = new THREE.TextureLoader().load('game/assets/' + characternumber + 'idle.png');
            idletexture.magFilter = THREE.NearestFilter;
            idletexture.minFilteer = THREE.NearestFilter;
            heromaterial.map = idletexture;
            timer = 0;
        }


        //

        //keys
        document.onkeydown = function (evt) {
            evt = evt || window.event;

            if (evt.keyCode == 37) { // left
                evt.preventDefault();
            }

            if (evt.keyCode == 39) { // right
                evt.preventDefault();
            }


        };
    }
}

class ThreeLayer extends Layer {
    constructor(options) {
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
        if (typeof options.initCharacters === "function") {
            options.initCharacters(this);
        } else {
            console.error("Your ThreeLayer needs an 'initCharacters' method");
        }

        this.worldObjects = [];
        if (typeof options.initWorld === "function") {
            options.initWorld(this);
        } else {
            console.error("Your ThreeLayer needs an 'initWorld' method");
        }

        if (typeof options.initLights === "function") {
            options.initLights(this);
        } else {
            console.error("Your ThreeLayer needs an 'initLights' method");
        }

        if (typeof options.initCamera === "function") {
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