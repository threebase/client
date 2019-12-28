const GAME_CONFIG = {
    guiPadding: 15,
    guiPanelWidth: "38%",
    guiBackgroundColor: "#333333",
    guiBackgroundOpacity: 0.7,

    emptyItemSlotImage: "game/assets/empty_item_slot.png",

    iconButtonSize: 30, 
    iconButtonOpacity: 0.5, 
    iconButtonFontColor: "#FFFFFF",
    iconButtonBackgroundColor: "#555555",
    iconButtonFontSize: 22,
    iconFontFamily: "FontAwesome",
    
    itemBorderWidth: 2,
    itemBorderRadius: 3,
    itemSize: 30,
    itemGutter: 2,
    itemQualityColors: {
        empty: "transparent",
        trash: "#CCCCCC", 
        common: "#FFFFFF", 
        fine: "#A3CB38", 
        excellent: "#1289A7", 
        superior: "#D980FA", 
        spectacular: "#ED4C67", 
        unbelievable: "#EE5A24", 
        godly: "#EA2027"
    },
    playerControls: {
        move: {
            onkeydown: (player, keyCode) => {
                switch (keyCode) {
                    case 37: // left arrow
                    case 65: // a
                        player.controls.left = true;
                        break;
                    case 38: // up arrow
                    case 87: // w
                        player.controls.up = true;
                        break;
                    case 39: // right arrow
                    case 68: // d
                        player.controls.right = true;
                        break;
                    case 40: // down arrow
                    case 83: // s
                        player.controls.down = true;
                        break;
                }
            },
            onkeyup: (player, keyCode) => {
                switch (keyCode) {
                    case 37: // left arrow
                    case 65: // a
                        player.controls.left = false;
                        break;
                    case 38: // up arrow
                    case 87: // w
                        player.controls.up = false;
                        break;
                    case 39: // right arrow
                    case 68: // d
                        player.controls.right = false;
                        break;
                    case 40: // down arrow
                    case 83: // s
                        player.controls.down = false;
                        break;
                }
            },
        }
    },
};

GAME_CONFIG.guiButtons = [
        {
            title: "Character (e)",
            hotkey: "e",
            iconClass: "fa fa-user-circle",
            html_panel: "character.html",
            panelType: "left",
            location: {
                bottom: "0%", // css style
                left: "0%"
            },
            onload: function(container) {
                // panel javascript onload logic goes here
            }
        },
        {
            title: "Skills (z)",
            hotkey: "z",
            iconClass: "fa fa-sitemap",
            html_panel: "skills.html",
            panelType: "left",
            location: {
                bottom: "0%", // css style
                left: `calc(0% + ${GAME_CONFIG.iconButtonSize}px)`
            },
            onload: function(container) {
                // panel javascript onload logic goes here
            }
        },
        {
            title: "Inventory (i)",
            hotkey: "i",
            iconClass: "fa fa-archive",
            html_panel: "inventory.html",
            panelType: "left",
            location: {
                bottom: "0%", // css style
                left: `calc(0% + ${GAME_CONFIG.iconButtonSize * 2}px)`
            },
            onload: function(container) {
                // panel javascript onload logic goes here
            }
        },
        {
            title: "Log (l)",
            hotkey: "l",
            iconClass: "fa fa-quote-left",
            html_panel: "log.html",
            panelType: "right",
            location: {
                bottom: "0%", // css style
                right: `calc(0% + ${GAME_CONFIG.iconButtonSize * 0}px)`
            },
            onload: function(container) {
                // panel javascript onload logic goes here
            }
        },
        {
            title: "Chat (q)",
            hotkey: "q",
            iconClass: "fa fa-commenting-o",
            html_panel: "chat.html",
            panelType: "dialog",
            location: {
                bottom: "0%", // css style
                right: `calc(0% + ${GAME_CONFIG.iconButtonSize * 1}px)`
            },
            onload: function(container) {
                // panel javascript onload logic goes here
            }
        },
        {
            title: "Map (m)",
            hotkey: "m",
            iconClass: "fa fa-map-o",
            html_panel: "map.html",
            panelType: "full",
            location: {
                bottom: "0%", // css style
                right: `calc(0% + ${GAME_CONFIG.iconButtonSize * 2}px)`
            },
            onload: function(container) {
                // panel javascript onload logic goes here
            }
        },
        {
            title: "Crafting (c)",
            hotkey: "c",
            iconClass: "fa fa-legal",
            html_panel: "crafting.html",
            panelType: "dialog",
            location: {
                bottom: "0%", // css style
                right: `calc(0% + ${GAME_CONFIG.iconButtonSize * 3}px)`
            },
            onload: function(container) {
                // panel javascript onload logic goes here
            }
        }
];

GAME_CONFIG.guiElements = [
    {
        id: "topleft",
        html_panel: "topleft.html",
        styles: {
            height: "50px",
            width: "200px",
            top: "0%", // css style
            left: "0%",
            backgroundColor: "red"
        },
        onstatchange: function(container) {

        }
    },
    {
        id: "topright",
        html_panel: "topright.html",
        styles: {
            height: "50px",
            width: "200px",
            top: "0%", // css style
            right: "0%",
            backgroundColor: "red"
        },
        onmove: function(container) {

        }
    },
];