$(document).ready(onPageLoad);


//	GAME CONSTANTS
var NUM_ROWS = 11;
var NUM_COLS = NUM_ROWS;

var BASE_ISLANDS = NUM_ROWS*NUM_COLS/20;
var RANGE_ISLANDS = 5;

var BASE_PIRATES = 3;
var RANGE_PIRATES = 2;
var PIRATES_PER_LEVEL = 1;
var MIN_PIRATE_DISTANCE = 7;


//	GAME VARIABLES
var level = 1;

var playerX = parseInt(NUM_COLS/2);
var playerY = parseInt(NUM_ROWS/2);
var playerAngle = 0;


//	ON PAGE LOAD - Called at startup.
function onPageLoad()
{
	//	LOAD GAME TABLE
	console.log("hello");
	initTable();
	setupListeners();
	loadLevel();
}

//	INIT TABLE - Creates initial game table.
function initTable()
{
	var content = "";

	//	Create table
	content += '<table>';

	for (var i = 0; i < NUM_ROWS; i++) {
		//	Create row
		content += '<tr class="row">';

		for (var j = 0; j < NUM_COLS; j++) {
			//	Create tiles
			content += '<td class="tile empty" id="'+i+'-'+j+'"></td>';
		};

		content += '</tr>';

	};

	//	Close table tag
	content += '</table>';	

	$('#game-div').append(content);
}

//	SETUP LISTENERS - Sets listeners on page.
function setupListeners()
{
	$('.tile').hover(onTileHover);
	$('.tile').click(onTileClick);
}

	//	ON TILE HOVER - Called when a tile is hovered over.
	function onTileHover()
	{
		if($(this).hasClass('hover')) return;

		$('.tile').removeClass('hover');
		$(this).addClass('hover');
	}

	//	ON TILE CLICK - Called when a tile is clicked
	function onTileClick()
	{
		//	Get tile coordinates
		var x,y;
		var id = $(this).attr('id');

		var x = parseInt(id.substr(0,id.indexOf('-')));
		var y = parseInt(id.substr(id.indexOf('-')+1));

		move(x,y);
	}

//	LOAD LEVEL - Adds initial values to tiles.
function loadLevel()
{
	addWhirlpools();
	addPlayer();
	addIslands();
	addPirates();
}

	//	ADD WHIRLPOOLS - Adds whirlpools in corners
	function addWhirlpools()
	{
		console.log('Adding whirlpools...');

		var x1 = 0;		var x2 = NUM_COLS-1;
		var y1 = 0;		var y2 = NUM_ROWS-1;

		setTile(x1, y1, 'whirlpool');
		setTile(x1, y2, 'whirlpool');
		setTile(x2, y1, 'whirlpool');
		setTile(x2, y2, 'whirlpool');
	}

	function addPlayer()
	{
		console.log('Adding player...');

		setTile(playerX, playerY,'player');
	}

	//	ADD ISLANDS - Adds islands to level.
	function addIslands()
	{
		console.log('Adding islands...');

		var num,randX,randY, randRange;

		randRange = parseInt(Math.random()*RANGE_ISLANDS - (RANGE_ISLANDS/2));

		num = 0;

		while(num < BASE_ISLANDS + randRange)
		{
			randX = parseInt(Math.random()*NUM_COLS);
			randY = parseInt(Math.random()*NUM_ROWS);

			if(setTile(randX, randY, 'island'))
				num++;
		}
	}

	//	ADD PIRATES - Adds pirates to level.
	function addPirates()
	{
		console.log('Adding pirates...');

		var num,randX,randY, randRange;

		randRange = parseInt(parseInt(Math.random()*RANGE_PIRATES) - (RANGE_PIRATES/2) + PIRATES_PER_LEVEL*(level-1));
		num = 0;

		while(num < BASE_PIRATES + randRange)
		{
			randX = parseInt(Math.random()*NUM_COLS);
			randY = parseInt(Math.random()*NUM_ROWS);

			if(getDistance(randX,randY,playerX,playerY) < MIN_PIRATE_DISTANCE) continue;

			if(setTile(randX, randY, 'pirate'))
				num++;
		}
	}

		function getDistance(x1, y1, x2, y2)
		{
			return (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2);
		}

	//	GET TILE - Returns value of tile.
	function getTile(x, y)
	{
		return _getTile('#'+x+'-'+y);
	}

		function _getTile(id)
		{
			if($(id).hasClass('whirlpool')) return 'whirlpool';
			if($(id).hasClass('player')) return 'player';
			if($(id).hasClass('pirate')) return 'pirate';
			if($(id).hasClass('island')) return 'island';
			
			return 'empty';
		}

	//	SET TILE - Returns true if tile is set.
	function setTile(x, y, type)
	{
		return _setTile('#'+x+'-'+y, type);
	}

		function _setTile(id, type)
		{
			if($(id).hasClass(type)) return false;

			if($(id).hasClass('empty'))
			{
				$(id).removeClass('empty');
				$(id).addClass(type);
				return true;
			}
			else return false;
		}

	//	RESET TILE - Returns true if tile is reset.
	function resetTile(x, y)
	{
		return _resetTile('#'+x+'-'+y);
	}

		function _resetTile(id)
		{
			if($(id).hasClass('empty')) return false;

			$(id).removeClass();
			$(id).addClass('tile');
			$(id).addClass('empty');

			return true;
		}

//	MOVE - Checks to see if player can interact with that tile.
function move(x, y)
{
	var pirateMove = false;
	var whirlpoolMove = false;

	//	Find tile distance
	var distance = getDistance(playerX,playerY,x,y);


	if(distance == 0)		//	PLAYER CLICKED
	{
		//	FIRE CANNONS
		alert("Fire cannons!");
	}
	else if(distance < 3)	//	ADJACENT OR DIAGONAL
	{
		//	Get object on tile
		var type = getTile(x,y);
		
		switch(type)
		{
			case 'whirlpool':
				whirlpoolMove = true;
				pirateMove = true;
				break;
			case 'island':
				return;
			case 'pirate':
				return;
			default: //	empty
				pirateMove = true;
				break;
		}

		if(x > playerX)
		{
			if(y > playerY)			//	MOVE DOWN RIGHT
			{
				playerAngle = 315;
			}
			else if(y < playerY)	//	MOVE UP RIGHT
			{
				playerAngle = 225;
			}
			else					//	MOVE RIGHT
			{
				playerAngle = 270;
			}
		}
		else if(x < playerX)
		{
			if(y > playerY)			//	MOVE DOWN LEFT
			{
				playerAngle = 45;
			}
			else if(y < playerY)	//	MOVE UP LEFT
			{
				playerAngle = 135;
			}
			else					//	MOVE LEFT
			{
				playerAngle = 90;
			}
		}
		else if(y < playerY)		//	MOVE UP
		{
			playerAngle = 180;
		}
		else						//	MOVE DOWN
		{
			playerAngle = 0;
		}

		//	Animate player movement
		resetTile(playerX,playerY);
		playerX = x;
		playerY = y;
		setTile(playerX, playerY,'player');
	}

	//	Handle the rest of the move
	if(whirlpoolMove) whirlpool();
	if(pirateMove) movePirates();
}

//	WHIRLPOOL - Move player to a random place on the map
function whirlpool()
{

}

//	MOVE PIRATES - Let pirates move
function movePirates()
{

}