var nodes = null;
function Node(aspect){
	this.aspect = aspect;
	this.distance = 0;//Unvisited
	this.active = true;
	this.links = [];
	for(var i in aspect.components) this.links.push(aspect.components[i]);
	for(var i in aspect.users) this.links.push(aspect.users[i]);
}
Node.prototype.visit = function(prevIndex){
	if(!this.distance || prevIndex + 1 < this.distance){
		this.distance = prevIndex + 1;
		for(var i in this.links){
			var link = nodes[this.links[i].name];
			if(link.active) link.visit(this.distance);
		}
	}
}
function initLib(){
	nodes = {};
	nodes.connect = function(asp1, asp2){
		for(var asp in this) this[asp].distance = 0;//Reset every node to its initial state.
		
		this[asp2].visit(0);//Visiting the end aspect makes it visit all of its neighbors, which makes each of those visit all of their own neighbors, and so on until every aspect has a distance (from the end).
		
		var node = this[asp1];//Get the node for the aspect at the start of the chain.
		var chain = [node];//This array will hold all of the nodes in the connection. At the start, it holds the starting node.
		chainLoop: while(node){//
			for(var i=0; i<node.links.length; i++){
				var link = this[node.links[i].name];
				if(link.active && link.distance == node.distance - 1){//Because the distance is the distance from the end,
					node = link;
					chain.push(node);
					continue chainLoop;//Next item in the chain
				}
			}
			node = null;//All links were iterated over and nothing was found; end loop
		}
		if(asp1 != asp2 && chain.length == 1) return null;//If there is only one link in the chain, either 1) the start and end aspects are the same or 2) no link was found.
		else return chain;//If the aspects are different and the chain is only 1 item, no link was found, so return nothing; otherwise, return the found connection.
	}
	
	aspects.selected.each(function(aspect){ nodes[aspect.name] = new Node(aspect); });
}
