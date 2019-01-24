// Basic states the window can be in
const NORMAL        = 0;
const MAXIMIZED     = 1;
const PACKED_UP     = 1 << 1;
const PACKED_DOWN   = 1 << 2;
const PACKED_LEFT   = 1 << 3;
const PACKED_RIGHT  = 1 << 4;

const WIDTH_RATE = 0.8;
const HEIGHT_RATE = 0.8;

// A window object is created each time a new window
// is created
function Window(id){
	this.id = id;
	this.state = NORMAL;
}


Window.prototype.isMax = function(){ return (this.state & MAXIMIZED) != 0;};
Window.prototype.isNormal = function(){ return this.state === NORMAL;};
Window.prototype.isPackedLeft = function(){ return (this.state & PACKED_LEFT) == PACKED_LEFT;};
Window.prototype.isPackedRight = function(){return (this.state & PACKED_RIGHT) == PACKED_RIGHT;};
Window.prototype.isPackedDown = function(){ return (this.state & PACKED_DOWN) == PACKED_DOWN;};
Window.prototype.isPackedUp = function(){ return (this.state & PACKED_UP) == PACKED_UP};

// window dictionary
var WINDOW_DB = {
	add: function(window){this[window.id] = window;},
	remove: function(window){delete this[window.id];},
	getWindow: function(id){return this[id];}
};

function performAction(newState, prevState){
	if(newState != prevState){
		actionsTable[newState + ""](newState, prevState);
	}
}

function setToNormalState(newState, prevState){
    
    //TODO only do the following if the client is tiled by the script
    
    //get the state of the active window
    var kwinClient = workspace.activeClient;
    var client = WINDOW_DB[kwinClient.windowId];
    if(!client) { return; }
    
    
    client.state = prevState;
    
    var pos = kwinClient.geometry;
    var x1 = pos.x;
    var y1 = pos.y;
    var x2 = x1 + kwinClient.width;
    var y2 = y1 + kwinClient.height;
    
    // calculate the dimensions of the screen
    var screenx1, screenx2, screeny1, screeny2;
    
    //get screenx1
    if(client.isPackedLeft() || client.isMax()){
        screenx1 = x1;
    } else if(client.isPackedRight()){
        screenx1 = x1 - (x2 - x1);
    } else{
        screenx1 = x1;
    }
    
    //get screeny1
    if(client.isPackedUp() || client.isMax()){
        screeny1 = y1;
    } else if(client.isPackedDown()){
        screeny1 = y1 - (y2 - y1);
    } else{
        screeny1 = y1;
    }    
    
    var area = workspace.clientArea(workspace.MaximizeArea, kwinClient.screen, kwinClient.desktop);    
    
    var screenWidth = area.width;
    var screenHeight = area.height;
    
    var padx = Math.floor((screenWidth - (screenWidth * WIDTH_RATE)) / 2);
    var pady = Math.floor((screenHeight - (screenHeight * HEIGHT_RATE)) / 2);
    
    var newX = screenx1 + padx;
    var newY = screeny1 + pady;
    var newWidth = Math.floor(screenWidth * WIDTH_RATE);
    var newHeight = Math.floor(screenHeight * HEIGHT_RATE);
    
    var geometry = kwinClient.geometry;    
    geometry.x = newX;
    geometry.y = newY;
    geometry.width = newWidth;
    geometry.height = newHeight;
    kwinClient.geometry = geometry;
    client.state = NORMAL;
}

// actionsTable BEGIN

var actionsTable ={};
actionsTable[MAXIMIZED + ""] = function(newState, prevState){
	workspace.slotWindowMaximize();
};
actionsTable[PACKED_RIGHT + ""] = function(newState, prevState){
	workspace.slotWindowQuickTileRight();
};
actionsTable[	PACKED_LEFT + ""] = function(newState, prevState){
	workspace.slotWindowQuickTileLeft();
};
actionsTable[PACKED_DOWN + ""] = function(newState, prevState){
    workspace.slotWindowQuickTileBottom();
};
actionsTable[PACKED_UP + ""] = function(newState, prevState){
    workspace.slotWindowQuickTileTop();
};
actionsTable[NORMAL + ""] = function(newState, prevState){
	setToNormalState(newState, prevState);
};
actionsTable[(PACKED_DOWN | PACKED_LEFT) + ""] = function(newState, prevState){
	workspace.slotWindowQuickTileBottomLeft();
};
actionsTable[(PACKED_DOWN | PACKED_RIGHT) + ""] = function(newState, prevState){
	workspace.slotWindowQuickTileBottomRight();
}
actionsTable[(PACKED_UP | PACKED_LEFT) + ""] = function(newState, prevState){
	workspace.slotWindowQuickTileTopLeft();
}
actionsTable[(PACKED_UP | PACKED_RIGHT) + ""] = function(newState, prevState){
	workspace.slotWindowQuickTileTopRight();
}

// actionsTable BEGIN

function getWindow(){
	return WINDOW_DB[workspace.activeClient.windowId];
}

// CALLBACK FUNCTION DEFINITIONS BEGIN
// these will be registered to keyboard shortcuts

function packUp(){
	var window = getWindow();
	if(window === undefined){ return; }
	var prevState = window.state;
    
	if(window.isMax()){
		return;
	}
	if(window.isPackedUp() && !(window.isPackedRight() || window.isPackedLeft())){
		window.state = MAXIMIZED;
		return performAction(window.state, prevState);
	} else if(window.isPackedDown()){
		window.state ^= PACKED_DOWN;
	} else{
		window.state |= PACKED_UP;
	}
	
	
	performAction(window.state, prevState);
}

function packDown(){
	var window = getWindow();
	if(window === undefined){ return; }
	var prevState = window.state;
	
	if(window.isMax()){
		window.state = NORMAL;
		return performAction(window.state, prevState);
	} else if(window.isPackedUp()){
		window.state ^= PACKED_UP;
	} else{
	window.state |= PACKED_DOWN;
	}
	performAction(window.state, prevState);
}

function packRight(){
	var window = getWindow();
	if(window === undefined){ return; }
	var prevState = window.state;

	if(window.isPackedLeft()){
		window.state ^= PACKED_LEFT;
	} else if(window.isMax()){
        window.state = PACKED_RIGHT;
    } else{
		window.state |= PACKED_RIGHT;
	}
	performAction(window.state, prevState);
}

function packLeft(){
	var window = getWindow();
	if(window === undefined){ return; }
	var prevState = window.state;

	if(window.isPackedRight()){
		window.state ^= PACKED_RIGHT;
	} else if(window.isMax()){
        window.state = PACKED_LEFT;  
    } else {
		window.state |= PACKED_LEFT;
	}
	performAction(window.state, prevState);
}

// CALLBACK FUNCTION DEFINITIONS END

// CONNECTING TO SIGNALS BEGIN

workspace.clientAdded.connect(function(client){
    if(!client.normalWindow){ return; }
	var window = new Window(client.windowId);
	WINDOW_DB.add(window);
    
    client.clientStartUserMovedResized.connect(function(client){
        if(WINDOW_DB[client.windowId]){
            WINDOW_DB[client.windowId].state = NORMAL;
        }
    });
});

workspace.clientRemoved.connect(function(client){
	if(WINDOW_DB[client.windowId] != undefined){
		var window = WINDOW_DB[client.windowId];
		WINDOW_DB.remove(window);
	}
});


workspace.clientMaximizeSet.connect(function(client, h, v){
    if(WINDOW_DB[client.windowId] != undefined && h & v){
		WINDOW_DB[client.windowId].state = MAXIMIZED;
	}
});
// CONNECTING TO SIGNALS END

// REGISTERING SHORTCUTS BEGIN
registerShortcut("Tile Up", "Tiles the window to the top (cinnamon-style)", "Meta+Up", packUp);
registerShortcut("Tile Down", "Tiles the window to the bottom (cinnamon-style)", "Meta+Down", packDown);
registerShortcut("Tile Left", "Tiles the window to the left (cinnamon-style)", "Meta+Left", packLeft);
registerShortcut("Tile Right", "Tiles the window to the right (cinnamon-style)", "Meta+Right", packRight);
// REGISTERING SHORTCUTS END