var DEBUG = true;

function Grid(x, y, z, mod_range, mode) {
	this.dimx = x;
	this.dimy = y;
	this.dimz = z;
	this.halfX = Math.floor(x / 2);
	this.halfY = Math.floor(y / 2);
	this.halfZ = Math.floor(z / 2);

	this.mode = mode;
	this.mod_range = mod_range;

	this.cells = {};
	this.new_cells = {};
	//all existing cells object

	this.get = function(x, y, z) {
		//turn xyz into key
		var key = "" + x + "," + y + "," + z;
		var cell_state = this.cells[key]
		if (cell_state) {
			return cell_state
		}
		return 0;
	}

	this.get_new = function(x, y, z) {
		//turn xyz into key
		var key = "" + x + "," + y + "," + z;
		var cell_state = this.new_cells[key]
		if (cell_state) {
			return cell_state
		}
		return 0;
	}
	//update new set of cells
	this.put = function(x, y, z, cell_state) {
		var key = "" + x + "," + y + "," + z;
		if (cell_state) {
			this.cells[key] = cell_state;
		} else {
			//research this
			delete this.cells[key];
		}
	}

	this.put_new = function(x, y, z, cell_state) {
		var key = "" + x + "," + y + "," + z;
		if (cell_state) {
			this.new_cells[key] = cell_state;
		} else {
			//research this
			delete this.new_cells[key];
		}
	}

	this.iterate = function(cb, frm) {
		new_cells = {};
		var hit = {};
		
		for (var non0 in this.cells) {
			if (non0 != undefined) {
				var xyz = eval('['+non0+']');
				var x=xyz[0];
				var y=xyz[1];
				var z=xyz[2];
				for (var i=x-1; i<=x+1; i++) {
					for (var j=y-1; j<=y+1; j++) {
						for (var k=z-1; k<=z+1; k++) {
							if (hit[[i, j, k]] == null) {
								hit[[i, j, k]] = true;
								var new_state = cb(this, i, j, k, frm);
								this.put_new(i, j, k, new_state);
							}
						}
					}
				}
			}
		}

		// for (var x = -this.halfX; x < this.halfX; x++) {
			// for (var y = -this.halfY; y < this.halfY; y++) {
				// for (var z = -this.halfZ; z < this.halfZ; z++) {
					// var new_state = cb(this, x, y, z);
					// this.put_new(x, y, z, new_state);
				// }
			// }
		// }
	}

	this.iterate_nop = function(cb, frm) {
		var new_cells = {};

		var hit = {};
		
		for (var non0 in this.cells) {
			if (non0 != undefined) {
				var xyz = eval('['+non0+']');
				var x=xyz[0];
				var y=xyz[1];
				var z=xyz[2];
				for (var i=x-1; i<=x+1; i++) {
					for (var j=y-1; j<=y+1; j++) {
						for (var k=z-1; k<=z+1; k++) {
							if (hit[[i, j, k]] == null) {
								hit[[i, j, k]] = true;
								cb(this, i, j, k, frm);
							}
						}
					}
				}
			}
		}
	}

	// copy new_cells to cells for setup and tests
	this.update = function() {
		this.cells = this.new_cells;
		this.new_cells = {};
	}
	
	this.clear = function() {
		this.cells = {};
		this_new_cells = {};
	}
}

//C2
test_rule = function(grid, x, y, z) {
	//if cell is alive--kill it
	//var cell = this.get(x,y,z);
	var neighbor = grid.get(x + 1, y, z);
	if (neighbor) {
		console.log("nabe @", x, y, z);
		return 1;
	} else {
		return 0;
	}
	//if cell at -1,y,z then come alive
}
if (DEBUG === true) {
	//TESTS
	var grid = new Grid(10, 10, 10);
	grid.put(0,0,0, 1);
	console.log("Should be 0: ", grid.get(3, 3, 3));
	console.log("Should be 1: ", grid.get(0,0,0));
	grid.put(0,0,0, 0);
	console.log("We deleted. Should be 0: ", grid.get(0,0,0));
	console.log("Should be empty: ", grid.cells);
	grid.clear();
	grid.put(0,0,0, 1);
	console.log("grid cells: ", grid.cells);
	grid.iterate(test_rule);
	grid.update();
	console.log("grid cells: ", grid.cells);
}

