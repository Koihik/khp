function CCBFile(){
	this.centeredOrigin = false;
	this.currentResolution = 0;
	this.currentSequenceId = 0;
	this.fileType = "CocosBuilder";
	this.fileVersion = 4;
	this.guides = [];
	this.jsControlled = false;
	this.nodeGraph = new RootNode();
	this.notes = [];
	this.resolutions = [{centeredOrigin:false,ext:"iphone",height:0,name:"iPhone",scale:1.0,width:0}];
	this.sequences = [
	{
		autoPlay:true,
		callbackChannel:{keyframes:[],type:10},
		chainedSequenceId:-1,
		length:10.0,
		name:"Default Timeline",
		offset:0.0,
		position:0.0,
		resolution:30.0,
		scale:128.0,
		sequenceId:0,
		soundChannel:{keyframes:[],type:9}
	}
	];
	this.stageBorder = 3;

	this.generateCCB = function(){
		this.nodeGraph.generateCCB();
		return this;
	};
}


function RootNode(){
	this.baseClass = "CCNode";
	this.children = [];
	this.customClass = "";
	this.displayName = "rootNode";
	this.memberVarAssignmentName = "";
	this.memberVarAssignmentType = 0;
	this.properties = [
	{
		name:"anchorPoint",
		type:"Point",
		value:[0.0,0.0]
	},
	{
		name:"scale",
		type:"ScaleLock",
		value:[1.0,1.0,false,0]
	},
	{
		name:"ignoreAnchorPointForPosition",
		type:"Check",
		value:false
	}
	];

	this.addChild = function(node){
		this.children.push(node);
	}
	this.generateCCB = function(){
		var tempArr = [];
		for(var i in this.children){
			tempArr.push(this.children[i]);
		}
		this.children = [];
		for(var i in tempArr){
			this.children.push(tempArr[i].toCCB());
		}
	}
}

function CCNode(){
	this.baseClass = "CCNode";
	this.children = [];
	this.customClass = "";
	this.displayName = "CCNode";
	this.memberVarAssignmentName = "";
	this.memberVarAssignmentType = 0;

	this.x = 0.0;
	this.y = 0.0;
	this.visible = true;
	this.anchorPoint = [0.5,0.5];
	this.scale = [1.0,1.0];
	this.skew = [0.0,0.0];
	this.rotation = 0.0;
	this.tag = -1;
	this.ignoreAnchorPointForPosition = false;

}

CCNode.prototype.addChild = function(node){
	this.children.push(node);
}

CCNode.prototype.parseAttr = function(attrArr){
	for(var i=0;i<attrArr.length;i++){
		var attrEntry = splitString(attrArr[i],":");
		var key = attrEntry[0];
		var value = attrEntry[1];
		switch(key){
			case "tag":
			this.tag = parseInt(value);
			break;
			default:
			this[key] = value;
		}
	}
}

CCNode.prototype.toCCB = function(){
	var ccbNode = {};
	ccbNode.baseClass = this.baseClass;
	ccbNode.customClass = this.customClass;
	ccbNode.displayName = this.displayName;
	ccbNode.memberVarAssignmentName = this.memberVarAssignmentName;
	ccbNode.memberVarAssignmentType = this.memberVarAssignmentType;

	ccbNode.properties = [];
	ccbNode.properties.push({
		name:"position",
		type:"Position",
		value:[this.x,this.y,0]
	});
	ccbNode.properties.push({
		name:"anchorPoint",
		type:"Point",
		value:this.anchorPoint
	});
	ccbNode.properties.push({
		name:"scale",
		type:"ScaleLock",
		value:[this.scale[0],this.scale[1],false,0]
	});
	ccbNode.properties.push({
		name:"ignoreAnchorPointForPosition",
		type:"Check",
		value:this.ignoreAnchorPointForPosition
	});
	ccbNode.properties.push({
		name:"visible",
		type:"Check",
		value:this.visible
	});
	ccbNode.properties.push({
		name:"rotation",
		type:"Degrees",
		value:this.rotation
	});
	ccbNode.properties.push({
		name:"skew",
		type:"FloatXY",
		value:this.skew
	});
	ccbNode.properties.push({
		name:"tag",
		type:"Integer",
		value:this.tag
	});

	ccbNode.children = [];
	for(var i in this.children){
		ccbNode.children.push(this.children[i].toCCB());
	}
	return ccbNode;
};

function CCSprite(){
	CCNode.call(this);
	this.baseClass = "CCSprite";
	this.displayName = "CCSprite";
	this.displayFrame = "";
	this.opacity = 255;
	this.r = 255;
	this.g = 255;
	this.b = 255;
	this.flipX = false;
	this.flipY = false;

}

CCSprite.prototype = new CCNode();

CCSprite.prototype.toCCB = function(){
	var ccbNode = CCNode.prototype.toCCB.call(this);
	ccbNode.properties.push({
		name:"displayFrame",
		type:"SpriteFrame",
		value:["",this.displayFrame]
	});
	ccbNode.properties.push({
		name:"opacity",
		type:"Byte",
		value:this.opacity
	});
	ccbNode.properties.push({
		name:"color",
		type:"Color3",
		value:[this.r,this.g,this.b]
	});
	ccbNode.properties.push({
		name:"flip",
		type:"Flip",
		value:[this.flipX,this.flipY]
	});
	return ccbNode;
}

function splitString(str,pattern){
	var outArr = [];
	var index = str.indexOf(pattern);
	while(index != -1){
		outArr.push(str.substring(0,index));
		str = str.substring(index+1,str.length);
		index = str.indexOf(pattern);
	}
	outArr.push(str);
	return outArr;
}