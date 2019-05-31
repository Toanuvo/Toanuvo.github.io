var numbers = 0;
var cursors = 0;



function Click(number){
    numbers = numbers + number;
	document.getElementById("numbers").innerHTML = numbers; 
};

function Save() {
	var save = {
    numbers: numbers,
    cursors: cursors,
	}
	localStorage.setItem("save",JSON.stringify(save));
};

function Load() {
	var savegame = JSON.parse(localStorage.getItem("save")); 
	if (typeof savegame.numbers !== "undefined") numbers = savegame.numbers;
	if (typeof savegame.cursors !== "undefined") cursors = savegame.cursors;
	
	document.getElementById("cursors").innerHTML = cursors;  
    document.getElementById("numbers").innerHTML = numbers;
	var nextCost = Math.floor(10 * Math.pow(1.1,cursors));       
    document.getElementById('cursorCost').innerHTML = nextCost

};

function Deletesave(){
	localStorage.removeItem("save")
}

function buyCursor(){
    var cursorCost = Math.floor(10 * Math.pow(1.1,cursors));     //works out the cost of this cursor
    if(numbers >= cursorCost){                                   //checks that the player can afford the cursor
        cursors = cursors + 1;                                   //increases number of cursors
    	numbers = numbers - cursorCost;                          //removes the cookies spent
        document.getElementById("cursors").innerHTML = cursors;  //updates the number of cursors for the user
        document.getElementById("numbers").innerHTML = numbers;  //updates the number of cookies for the user
    };
    var nextCost = Math.floor(10 * Math.pow(1.1,cursors));       //works out the cost of the next cursor
    document.getElementById('cursorCost').innerHTML = nextCost;  //updates the cursor cost for the user
};

window.setInterval(function(){
Click(cursors); 

}, 1000);