const Utility = {
    spriteSheetTimers: {}, // for caching dr_okra style
    getItemWrapper: (itemObj) => {
        const div = document.createElement("div");
        div.className = "item-rarity-wrapper";
        div.style.position = "absolute";
        div.style.width = "100%";
        div.style.height = "100%";
        div.style.boxSizing = "border-box";
        const bw = GAME_CONFIG.itemBorderWidth;
        const bc = GAME_CONFIG.itemQualityColors[itemObj.quality];
        div.style.border = `${bw}px solid ${bc}`;
        const br = GAME_CONFIG.itemBorderRadius;
        div.style.borderRadius = `${br}px`;
    },
    clickIconButton: (buttonOptions) => {
        if(!buttonOptions.currentlyShowing){
            fetch(`abstract/html_panels/${buttonOptions.html_panel}`)
                .then(r=>r.text())
                .then(html => {
                    guiLayer.showPanel(buttonOptions.panelType,html);
                    buttonOptions.currentlyShowing = true;
                    if(buttonOptions.onload) {
                        buttonOptions.onload(guiLayer[`${buttonOptions.panelType}Panel`]);
                    }
                })
                ;
        } else {
            guiLayer.hidePanel(buttonOptions.panelType);
            buttonOptions.currentlyShowing = false;
        }
    },
    fetchPanel: (fileName, callback) => {
        fetch(`abstract/html_panels/${fileName}`)
            .then(r=>r.text())
            .then(html => {
                callback(html);
            })
            ;
    }
};
Utility.itemToCell = function(title, itemObj) {
    if(typeof itemObj === "undefined") {
        itemObj = {
            quality: "empty",
            img: GAME_CONFIG.emptyItemSlotImage
        };
    }
    const div = document.createElement("div");
    div.className = "item-rarity-wrapper";
    div.style.position = "absolute";
    div.style.width = GAME_CONFIG.itemSize + "px";
    div.style.height = GAME_CONFIG.itemSize + "px";
    div.style.backgroundImage = `url(${itemObj.img})`;
    const wrapper = Utility.getItemWrapper(itemObj);
    wrapper.appendChild(div);
    div.appendChild(wrapper);
};
Utility.spriteSheetTexture = (id, options) => {
    let frameW = 0;
    let frameH = 0;
    let x = 0;
    let y = 0;
    let count = 0;
    const framesX = options.frames;
    const endFrame = options.frames;
    const canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    ctx.scale(options.horiz_scale,options.vert_scale);
    const canvasTexture = new THREE.CanvasTexture(canvas); //TODO: performance boost for caching this per-frame
    const img = new Image();
    if(Utility.spriteSheetTimers[id]){
        clearInterval(Utility.spriteSheetTimers[id]);
    }
    img.onload = function () {
        canvas.width = frameW = img.width / framesX;
        canvas.height = frameH = img.height;
        let iterator = 1;
        Utility.spriteSheetTimers[id] = setInterval(()=>{
            count += iterator;
            if (count >= endFrame) {
                if (options.repeat === false) {
                    iterator = 0;
                    clearInterval(Utility.spriteSheetTimers[id]);
                    return;
                } else if (options.reverse === true) {
                    iterator *= -1;
                    count += iterator;
                } else {
                    count = 0;
                }
            }
            x = (count % framesX) * frameW;
            y = ((count / framesX) | 0) * frameH;
            ctx.clearRect(0, 0, frameW, frameH);
            ctx.drawImage(img,x,y,frameW,frameH,0,0,frameW,frameH);
            canvasTexture.needsUpdate = true;
        }, options.frameDelay);
    };
    img.src = options.img;
    return canvasTexture;
}